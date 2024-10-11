"use client";

import { socket } from "@/app/socket";
import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import {
  listener,
  messages,
  searchResults,
  TUser,
  upvVotes,
} from "@/lib/types";
import { useEffect, useState, useCallback, useRef } from "react";
import { toast } from "sonner";

export default function useSocket() {
  const { isConnected, setIsConnected } = useUserContext();
  const [transport, setTransport] = useState("N/A");
  const { setListener, setUser, setQueue, user, setUpVotes, setMessages } =
    useUserContext();
  const { play, seek } = useAudio();
  const socketRef = useRef(socket);

  // Memoized connect and disconnect functions
  const onConnect = useCallback(() => {
    setIsConnected(true);
    setTransport(socketRef.current.io.engine.transport.name);

    socketRef.current.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }, [setIsConnected]);

  const onDisconnect = useCallback(() => {
    setIsConnected(false);
    setTransport("N/A");
  }, [setIsConnected]);

  const handleJoinedRoom = useCallback(
    ({ user, listeners }: { user: TUser; listeners: listener }) => {
      toast.dismiss("joining");
      toast.message("Joined successfully");

      if (user) setUser((prev) => ({ ...prev, ...user }));
      if (listeners) setListener(listeners);
    },
    [setUser, setListener]
  );

  const handleUserJoinedRoom = useCallback(
    ({ user, listeners }: { user: TUser; listeners: listener }) => {
      if (user) toast(`${user.username} has joined`);
      if (listeners) setListener(listeners);
    },
    [setListener]
  );

  const handleUserLeftRoom = useCallback(
    ({ user, listeners }: { user: TUser; listeners: listener }) => {
      if (user)
        toast(`${user.username} left`, {
          style: { backgroundColor: "#e94225" },
        });
      if (listeners) setListener(listeners);
    },
    [setListener]
  );

  const handleSongEnded = useCallback(
    (data?: {
      play?: searchResults;
      queue?: searchResults[];
      votes?: upvVotes[];
    }) => {
      if (data?.play) play(data.play);
      socket.emit("getSongQueue");

      if (data?.votes) setUpVotes(data.votes);
    },
    [play, setUpVotes]
  );

  const handleSeek = useCallback(
    (data: { seek: number; role: string; userId: string }) => {
      if (data.role === "admin" && data.userId === user?._id) return;
      seek(data.seek);
    },
    [seek, user?._id]
  );

  // Centralized event listeners setup and cleanup
  useEffect(() => {
    const currentSocket = socketRef.current;

    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);
    currentSocket.on("nextSong", play);
    currentSocket.on("prevSong", play);
    currentSocket.on("joinedRoom", handleJoinedRoom);
    currentSocket.on("userJoinedRoom", handleUserJoinedRoom);
    currentSocket.on("userLeftRoom", handleUserLeftRoom);
    currentSocket.on("songEnded", handleSongEnded);
    currentSocket.on("seek", handleSeek);

    currentSocket.on("songQueue", () => socket.emit("getSongQueue"));
    currentSocket.on("queueList", setQueue);
    currentSocket.on("votes", (data) => data?.queue && setQueue(data.queue));
    currentSocket.on("getVotes", () => socket.emit("upVote"));
    currentSocket.on("message", (message: messages) => {
      setMessages((prev) => [...prev, message]);
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
      );
      if (document.hidden) {
        audio.play();
      } else {
        audio.pause();
        audio.currentTime = 0; // Reset the audio if needed
      }
    });

    currentSocket.on("error", (message: string) => {
      toast.error(message, { style: { background: "#e94625" } });
    });
    currentSocket.on("connect_error", (error: any) => {
      toast.error(error?.message || "Something went wrong", {
        style: { background: "#e94625" },
      });
    });

    return () => {
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
      currentSocket.off("nextSong", play);
      currentSocket.off("prevSong", play);
      currentSocket.off("joinedRoom", handleJoinedRoom);
      currentSocket.off("userJoinedRoom", handleUserJoinedRoom);
      currentSocket.off("userLeftRoom", handleUserLeftRoom);
      currentSocket.off("songEnded", handleSongEnded);
      currentSocket.off("seek", handleSeek);
      currentSocket.off("songQueue");
      currentSocket.off("queueList");
      currentSocket.off("votes");
      currentSocket.off("getVotes");
      currentSocket.off("message");
      currentSocket.off("error");
      currentSocket.off("connect_error");
    };
  }, [
    onConnect,
    onDisconnect,
    play,
    handleJoinedRoom,
    handleUserJoinedRoom,
    handleUserLeftRoom,
    handleSongEnded,
    handleSeek,
    setQueue,
    setMessages,
  ]);

  return {
    isConnected,
    transport,
  };
}
