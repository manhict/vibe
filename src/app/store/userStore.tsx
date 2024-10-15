"use client";
import {
  listener,
  messages,
  searchResults,
  spotifyPlaylist,
  TUser,
} from "@/lib/types";
import { generateRoomId, setCookie } from "@/utils/utils";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, {
  createContext,
  ReactNode,
  SetStateAction,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { socket } from "../socket";
import { toast } from "sonner";

interface UserContextType {
  queue: searchResults[];
  setQueue: React.Dispatch<SetStateAction<searchResults[]>>;
  roomId: string | null;
  setRoomId: React.Dispatch<SetStateAction<string>>;
  isConnected: boolean;
  setIsConnected: React.Dispatch<SetStateAction<boolean>>;
  user: TUser | null;
  setUser: React.Dispatch<SetStateAction<TUser | null>>;
  setListener: React.Dispatch<SetStateAction<listener | null>>;
  listener: listener | null;
  messages: messages[];
  setMessages: React.Dispatch<SetStateAction<messages[]>>;
  spotifyPlaylists: spotifyPlaylist[] | null;
  setSpotifyPlaylists: React.Dispatch<SetStateAction<spotifyPlaylist[] | null>>;
  likEffectUser: { imageUrl: string }[] | [];
  setLikEffectUser: React.Dispatch<SetStateAction<{ imageUrl: string }[] | []>>;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const search = useSearchParams();
  const path = usePathname();
  const router = useRouter();
  const [isConnected, setIsConnected] = useState<boolean>(socket.connected);
  const [queue, setQueue] = React.useState<searchResults[]>([]);
  const [messages, setMessages] = React.useState<messages[]>([]);
  const [user, setUser] = React.useState<TUser | null>(null);
  const [likEffectUser, setLikEffectUser] = React.useState<
    { imageUrl: string }[] | []
  >([]);
  const [spotifyPlaylists, setSpotifyPlaylists] = React.useState<
    spotifyPlaylist[] | null
  >(null);
  const [listener, setListener] = React.useState<listener | null>(null);
  const [roomId, setRoomId] = React.useState<string>(
    () => search.get("room") || generateRoomId()
  );

  useEffect(() => {
    if (!path.startsWith("/v")) return;
    router.push(`/v?room=${roomId}`);
    setCookie("room", roomId);
    if (roomId && socket.disconnected) {
      const t = setTimeout(() => {
        socket.io.opts.extraHeaders = {
          Authorization: `${user?.token}`,
          Room: `${roomId}`,
        };
        socket.connect();
        toast.loading(`Joining room ${roomId}`, {
          id: "joining",
          duration: Infinity,
        });
      }, 1000);
      return () => clearTimeout(t);
    }
  }, [roomId, router, user, path]);

  const value = useMemo(
    () => ({
      queue,
      setQueue,
      roomId,
      setRoomId,
      setIsConnected,
      isConnected,
      user,
      setUser,
      listener,
      setListener,
      messages,
      setMessages,
      likEffectUser,
      setLikEffectUser,
      spotifyPlaylists,
      setSpotifyPlaylists,
    }),
    [
      isConnected,
      listener,
      messages,
      queue,
      roomId,
      spotifyPlaylists,
      user,
      likEffectUser,
    ]
  );
  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

const useUserContext = (): UserContextType => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUserContext must be used within a UserProvider");
  }
  return context;
};

export { UserProvider, useUserContext };
