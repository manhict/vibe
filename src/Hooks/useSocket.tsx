"use client";
import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
  ReactNode,
  SetStateAction,
} from "react";
import { socket } from "@/app/socket";
import { toast } from "sonner";
import { data, listener, messages, TUser } from "@/lib/types";
import { decrypt } from "@/utils/lock";
import api from "@/lib/api";
import { useUserContext } from "@/app/store/userStore";
import { useAudio } from "@/app/store/AudioContext";

// Define the shape of a message
export interface Message {
  id: string;
  content: string;
  sender: string;
}

// Define the shape of the context state
interface SocketContextType {
  isConnected: boolean;
  loading: boolean;
  total: number;
  transport: string;
  messages: messages[];
  handleUpdateQueue: () => void;
  setMessages: React.Dispatch<React.SetStateAction<messages[]>>;
  likEffectUser: { imageUrl: string }[];
  setLikEffectUser: React.Dispatch<
    React.SetStateAction<{ imageUrl: string }[]>
  >;
  setPage: React.Dispatch<SetStateAction<number | null>>;
}

// Default context value
const SocketContext = createContext<SocketContextType | null>(null);

// Custom hook to use UserContext
export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a socketProvider");
  }
  return context;
};

// Define props for the UserProvider
interface SocketProviderProps {
  children: ReactNode;
}
export const SocketProvider = ({ children }: SocketProviderProps) => {
  const { setQueue, queue, setListener } = useUserContext();
  const { seek, play } = useAudio();
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const [transport, setTransport] = useState<string>("N/A");
  const [messages, setMessages] = useState<messages[]>([]);
  const [likEffectUser, setLikEffectUser] = useState<{ imageUrl: string }[]>(
    []
  );
  const [loading, setLoading] = useState<boolean>(false);
  const [page, setPage] = useState<number | null>(1);
  const [total, setTotal] = useState<number>(50);
  const socketRef = useRef(socket);

  // Memoized connect and disconnect functions
  const onConnect = useCallback((): void => {
    setIsConnected(true);
    setTransport(socketRef.current.io.engine.transport.name);
    socketRef.current.io.engine.on("upgrade", (transport) => {
      setTransport(transport.name);
    });
  }, []);

  const onDisconnect = useCallback((): void => {
    setIsConnected(false);
    setTransport("N/A");
    toast.error("Connection Lost");
  }, []);

  const handleMessage = useCallback((data: any): void => {
    const message = decrypt(data) as messages;
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
  }, []);

  const updateListeners = useCallback(async () => {
    const data = await api.get("/api/listeners");
    if (data.success) {
      setListener(data.data as listener);
    }
  }, [setListener]);

  const handleHeart = useCallback((data: any) => {
    const value = decrypt(data) as { imageUrl: string };
    if (value?.imageUrl) {
      setLikEffectUser([value]);
    }
  }, []);

  const handleError = useCallback((message: string): void => {
    toast.dismiss("connecting");
    toast.error(decrypt(message), { style: { background: "#e94625" } });
  }, []);

  const handleConnectError = useCallback((error: Error): void => {
    toast.dismiss("connecting");
    toast.error(error?.message || "Unable to connect to server", {
      style: { background: "#e94625" },
    });
  }, []);

  const handleUserLeftRoom = useCallback(
    async (data: any) => {
      const user = decrypt(data) as TUser;
      updateListeners();
      toast.info(`${user?.username} has left`, {
        style: { background: "#e94625" },
      });
    },
    [updateListeners]
  );

  const handleUserJoinedRoom = useCallback(
    async (data: any) => {
      const user = decrypt(data) as TUser;
      updateListeners();
      toast.info(`${user?.username} has Joined`);
    },
    [updateListeners]
  );

  const handleUpdateQueue = useCallback(async () => {
    if (queue.length >= total) return;
    setLoading(true);
    const data = await api.get(`/api/queue?page=${page}&name`);
    if (data.success) {
      const value = data.data as data;
      setQueue((prev) => {
        // Create a Set to track the unique IDs of songs already in the queue
        const existingIds = new Set(prev.map((song) => song.id));

        // Filter out duplicate songs from selectedSongs based on their ID
        const filteredSongs = value.results.filter(
          (song) => !existingIds.has(song.id)
        );

        // Return the new state, adding only the filtered songs
        return [...prev, ...filteredSongs];
      });
      setTotal(value?.total);
      setPage(value?.start + 1);
    }
    setLoading(false);
  }, [setQueue, page, queue, total]);

  const forceUpdateQueue = useCallback(async () => {
    setLoading(true);
    const data = await api.get(`/api/queue?page=1&limit=${queue.length}&name`);
    if (data.success) {
      const value = data.data as data;
      setQueue(value?.results);
      setTotal(value?.total);
      setPage(1);
    }
    setLoading(false);
  }, [setQueue, queue]);

  const handleJoined = useCallback(
    async (data: any) => {
      const value = decrypt(data) as {
        roomId: string;
        _id: string;
        progress: number;
      };

      seek(value?.progress || 0);
      toast.dismiss("connecting");
      toast.info("Joined successfully");
      updateListeners();
      handleUpdateQueue();
    },
    [handleUpdateQueue, seek, updateListeners]
  );

  // Centralized event listeners setup and cleanup
  useEffect(() => {
    const currentSocket = socketRef.current;
    currentSocket.on("connect", onConnect);
    currentSocket.on("disconnect", onDisconnect);
    currentSocket.on("heart", handleHeart);
    currentSocket.on("error", handleError);
    currentSocket.on("connect_error", handleConnectError);
    currentSocket.on("message", handleMessage);
    currentSocket.on("userLeftRoom", handleUserLeftRoom);
    currentSocket.on("userJoinedRoom", handleUserJoinedRoom);
    currentSocket.on("joined", handleJoined);
    currentSocket.on("update", forceUpdateQueue);
    currentSocket.on("isplaying", (d) => play(decrypt(d)));
    currentSocket.on("play", (d) => play(decrypt(d)));
    currentSocket.on("seek", seek);
    return () => {
      currentSocket.off("connect", onConnect);
      currentSocket.off("disconnect", onDisconnect);
      currentSocket.off("message", handleMessage);
      currentSocket.off("heart", handleHeart);
      currentSocket.off("error", handleError);
      currentSocket.off("connect_error", handleConnectError);
      currentSocket.off("userLeftRoom", handleUserLeftRoom);
      currentSocket.off("userJoinedRoom", handleUserJoinedRoom);
      currentSocket.off("update", forceUpdateQueue);
      currentSocket.off("joined", handleJoined);
      currentSocket.off("isplaying");
      currentSocket.off("play");
      currentSocket.off("seek", seek);
    };
  }, [
    handleUserLeftRoom,
    onConnect,
    handleJoined,
    onDisconnect,
    handleMessage,
    handleHeart,
    handleError,
    handleConnectError,
    handleUserJoinedRoom,
    forceUpdateQueue,
    play,
    seek,
  ]);

  return (
    <SocketContext.Provider
      value={{
        isConnected,
        transport,
        messages,
        likEffectUser,
        setMessages,
        setLikEffectUser,
        total,
        loading,
        handleUpdateQueue,

        setPage,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};
