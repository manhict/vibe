"use client";
import { Button } from "@/components/ui/button";
import { Search, Share2 } from "lucide-react";
import Listeners from "./Listeners";
import QueueList from "./QueueList";
import { useUserContext } from "@/app/store/userStore";
import SearchSongPopup from "../SearchSongPopup";
import { FaSpotify } from "react-icons/fa";
import React, { useCallback, useState } from "react";
import { toast } from "sonner";
import Link from "next/link";
import SpotifyPlaylist from "./SpotifyPlaylist";
import { Input } from "../ui/input";

function AddToQueue() {
  const { queue, roomId, user } = useUserContext();
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
  return (
    <div className=" select-none max-md:rounded-none max-md:border-none  backdrop-blur-lg  max-h-full border flex flex-col gap-2 max-md:w-full border-[#49454F] w-[45%] rounded-xl p-4">
      <div className=" flex items-center justify-between">
        <p className=" text-lg font-semibold">In Queue</p>
        <div className=" flex items-center">
          <Button
            onClick={() => setOpenSearch((prev) => !prev)}
            variant={"secondary"}
            className=" bg-purple p-2.5 rounded-md"
          >
            <Search className=" size-4" />
          </Button>
        </div>
      </div>
      {isSearchedOpened && (
        <Input
          onChange={(e) => setName(e.target.value)}
          placeholder="Search in queue"
          className=" mt-2 py-2"
        />
      )}
      <div className="h-full z-50 overflow-y-scroll">
        {queue.length > 0 ? (
          <QueueList name={name} />
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
          {/* <div className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-md px-2 text-xs bg-red-500 opacity-50 w-fit hover:bg-red-500 hover:opacity-80 duration-300">
            {" "}
            <FaYoutube className="size-4" />
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default AddToQueue;
