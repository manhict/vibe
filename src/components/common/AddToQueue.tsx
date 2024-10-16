"use client";
import { Button } from "@/components/ui/button";
import { Search, Share2, Trash2, X } from "lucide-react";
import Listeners from "./Listeners";
import QueueList from "./QueueList";
import { useUserContext } from "@/app/store/userStore";
import SearchSongPopup from "../SearchSongPopup";
import React, { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Input } from "../ui/input";
import Youtube from "./Youtube";
import { motion } from "framer-motion";
import { slideInVariants } from "@/utils/utils";
import { socket } from "@/app/socket";
import { useAudio } from "@/app/store/AudioContext";
import useSelect from "@/Hooks/useSelect";

function AddToQueue() {
  const { queue, roomId, user, setQueue } = useUserContext();
  const { currentSong } = useAudio();
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

  const handleToggleSearch = () => {
    if (isSearchedOpened) {
      // Close the search, but wait for the animation to finish before setting the state
      setOpenSearch(false);
    } else {
      // Open the search immediately
      setOpenSearch(true);
    }
  };

  const { handleSelect, selectedSongs, setSelectedSongs } = useSelect();
  const handleBulkDelete = () => {
    if (selectedSongs.length > 0) {
      socket.emit("bulkDelete", selectedSongs);
      setQueue((prevQueue) =>
        prevQueue.filter((song) => !selectedSongs.includes(song))
      );
      setSelectedSongs([]);
    }
  };
  const handleRemoveALL = () => {
    socket.emit("deleteAll");
    setQueue((prev) => prev.filter((r) => r.id == currentSong?.id));
    setSelectedSongs([]);
  };

  return (
    <div className=" select-none max-md:rounded-none max-md:border-none  backdrop-blur-lg  max-h-full border flex flex-col gap-2 max-md:w-full border-[#49454F] w-[45%] rounded-xl p-4">
      <div className=" flex items-center gap-2.5 justify-between">
        {isSearchedOpened ? (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="exit"
            className=" w-full"
            variants={slideInVariants}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 20, // tweak this for smoother exit
              duration: 0.4, // Adjust duration for a slower effect
            }}
          >
            <Input
              autoFocus
              onChange={(e) => setName(e.target.value)}
              placeholder="Search in queue"
              className="py-2"
            />
          </motion.div>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }} // Add a transition for the label
            className="text-lg font-semibold"
          >
            In Queue
          </motion.p>
        )}
        <div className=" flex items-center gap-1">
          <Button
            onClick={handleToggleSearch}
            variant={"secondary"}
            className=" bg-purple p-2.5 hover:bg-purple/80 rounded-md"
          >
            {isSearchedOpened ? (
              <X className=" size-4" />
            ) : (
              <Search className=" size-4" />
            )}
          </Button>
          {user && user.role === "admin" && queue.length > 1 && (
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
      {isDeleting && queue.length > 1 && (
        <motion.div
          initial="hidden"
          animate="visible"
          exit="exit"
          variants={slideInVariants}
          transition={{
            type: "spring",
            stiffness: 300,
            damping: 20, // tweak this for smoother exit
            duration: 0.4, // Adjust duration for a slower effect
          }}
          className=" flex overflow-x-scroll py-1 -mb-1 mt-2 items-center gap-1"
        >
          <Button
            onClick={handleBulkDelete}
            size={"sm"}
            className=" w-fit bg-purple text-white hover:bg-purple/80"
          >
            Remove Selected {selectedSongs.length}
          </Button>

          <Button
            disabled={selectedSongs.length == 0}
            onClick={() => setSelectedSongs([])}
            size={"sm"}
            className=" w-fit bg-purple text-white hover:bg-purple/80"
          >
            Unselect all
          </Button>
          <Button
            onClick={handleRemoveALL}
            size={"sm"}
            className=" w-fit bg-red-600/85 text-white hover:bg-red-600/70"
          >
            Clear all
          </Button>
        </motion.div>
      )}
      <div className="h-full transition-all z-50 overflow-y-scroll">
        {queue.length > 0 ? (
          <QueueList
            name={name}
            handleSelect={handleSelect}
            selectedSongs={selectedSongs}
            isDeleting={isDeleting}
          />
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
            <Share2 className="size-3.5 mr-0.5" /> <span>Invite Friends</span>
          </div>

          {/* {user && (
            <>
              {user?.spotify ? (
                <SpotifyPlaylist />
              ) : (
                <Link
                  href={`https://accounts.spotify.com/en/authorize?client_id=${process.env.SPOTIFY_CLIENT_ID}&scope=playlist-read-private&response_type=code&redirect_uri=${process.env.SPOTIFY_REDIRECT_URL}`}
                  className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-md px-2 text-xs bg-green-500 opacity-50 w-fit hover:bg-green-500 hover:opacity-80 duration-300"
                >
                  <FaSpotify className="size-4" />
                </Link>
              )}
            </>
          )} */}
          <div className="inline-flex items-center justify-center whitespace-nowrap font-medium transition-all focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-md px-2 text-xs bg-red-500 w-fit hover:bg-red-500 hover:opacity-80 duration-300">
            <Youtube />
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddToQueue;
