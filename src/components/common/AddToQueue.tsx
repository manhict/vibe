"use client";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  Loader2Icon,
  Search,
  Share2,
  Trash2,
  X,
} from "lucide-react";
import Listeners from "./Listeners";
import QueueList from "./QueueList";
import { useUserContext } from "@/app/store/userStore";
import SearchSongPopup from "../SearchSongPopup";
import { FaSpotify, FaYoutube } from "react-icons/fa";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import SpotifyPlaylist from "./SpotifyPlaylist";
import { Input } from "../ui/input";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import api from "@/lib/api";
import { extractPlaylistID } from "@/utils/utils";
import { searchResults } from "@/lib/types";
import { socket } from "@/app/socket";
import useDebounce from "@/Hooks/useDebounce";

function AddToQueue() {
  const { queue, roomId, user, setQueue } = useUserContext();
  const handleShare = useCallback(async () => {
    if (!user) return;
    try {
      await navigator
        .share({
          url:
            window.location.origin +
            "/v/?room=" +
            roomId +
            "&ref=" +
            user.username,
        })
        .then(() => {
          toast.success("Shared the link successfully!");
        });
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [roomId, user]);
  const [name, setName] = useState<string>("");
  const [isSearchedOpened, setOpenSearch] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  useEffect(() => {
    if (queue.length <= 1) {
      setIsDeleting(false);
    }
  }, [queue]);
  const [loading, setLoading] = useState<boolean>(false);
  const closeRef = useRef<HTMLButtonElement>(null);
  const loadPlaylist = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const playlistuRL = e.target.value;
      if (playlistuRL.trim().length === 0) {
        return;
      }
      setLoading(true);

      const tracks = await api.get(
        `/api/youtube?id=${extractPlaylistID(playlistuRL)}&room=${roomId}`
      );
      if (tracks.success) {
        toast.success("Imported successfully");
        setQueue(tracks.data as searchResults[]);
        closeRef.current?.click();
        socket.emit("getSongQueue");
      }
      setLoading(false);
    },
    [roomId, setQueue]
  );
  const handleLoad = useDebounce(loadPlaylist, 500);
  return (
    <div className=" select-none max-md:rounded-none max-md:border-none  backdrop-blur-lg  max-h-full border flex flex-col gap-2 max-md:w-full border-[#49454F] w-[45%] rounded-xl p-4">
      <div className=" flex items-center justify-between">
        <p className=" text-lg font-semibold">In Queue</p>
        <div className=" flex items-center gap-1">
          <Button
            onClick={() => setOpenSearch((prev) => !prev)}
            variant={"secondary"}
            className=" bg-purple p-2.5 hover:bg-purple/80 rounded-md"
          >
            <Search className=" size-4" />
          </Button>
          {user && user.role == "admin" && queue.length > 1 && (
            <Button
              onClick={() => {
                if (queue.length <= 1) return;
                setIsDeleting((prev) => !prev);
              }}
              variant={"secondary"}
              className=" bg-purple p-2.5 hover:bg-purple/80 rounded-md"
            >
              {isDeleting ? (
                <X className=" size-4" />
              ) : (
                <Trash2 className=" size-4" />
              )}
            </Button>
          )}
        </div>
      </div>
      {isSearchedOpened && (
        <Input
          autoFocus
          onChange={(e) => setName(e.target.value)}
          placeholder="Search in queue"
          className=" mt-2 py-2"
        />
      )}
      <div className="h-full z-50 overflow-y-scroll">
        {queue.length > 0 ? (
          <QueueList name={name} isDeleting={isDeleting} />
        ) : (
          <SearchSongPopup isAddToQueue />
        )}
      </div>
      <div className=" flex items-center justify-between">
        <Listeners className=" max-md:hidden" />
        <div className=" flex items-center gap-1">
          <div
            onClick={handleShare}
            className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-md px-1.5 text-xs bg-purple w-fit hover:bg-[#7140c5]"
          >
            {" "}
            <Share2 className="size-3.5 mr-0.5" /> <span>Invite Friends</span>
          </div>

          {user && (
            <>
              {user?.spotify ? (
                <SpotifyPlaylist />
              ) : (
                <Link
                  href={`https://accounts.spotify.com/en/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=playlist-read-private&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URL}`}
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-md px-2 text-xs bg-green-500 opacity-50 w-fit hover:bg-green-500 hover:opacity-80 duration-300"
                >
                  {" "}
                  <FaSpotify className="size-4" />
                </Link>
              )}
            </>
          )}
          <div className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-md px-2 text-xs bg-red-500 w-fit hover:bg-red-500 hover:opacity-80 duration-300">
            {" "}
            <Dialog>
              <DialogTrigger>
                <FaYoutube className="size-4" />
              </DialogTrigger>
              <DialogContent className="flex bg-transparent flex-col w-full overflow-hidden rounded-2xl gap-0 p-0 border-none max-w-2xl max-md:max-w-sm">
                <div className="bg-black rounded-t-xl flex items-center justify-between p-2.5 px-5">
                  <DialogClose>
                    <ArrowLeft className="text-zinc-500 cursor-pointer" />
                  </DialogClose>
                  <Input
                    autoFocus
                    onChange={handleLoad}
                    placeholder="Paste youtube playlist url"
                    className="border-none focus-visible:ring-0"
                  />
                  <DialogClose ref={closeRef}>
                    {loading ? (
                      <Loader2Icon className="text-zinc-500 animate-spin" />
                    ) : (
                      <X className="text-zinc-500 cursor-pointer" />
                    )}
                  </DialogClose>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToQueue;
