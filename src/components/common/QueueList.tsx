import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import { formatArtistName } from "@/utils/utils";
import { Heart, Trash } from "lucide-react";
import React, { useCallback } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";

import { socket } from "@/app/socket";
import { searchResults } from "@/lib/types";
import useDebounce from "@/Hooks/useDebounce";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";

function QueueList() {
  const { queue, setQueue, user } = useUserContext();
  const { currentSong } = useAudio();

  const upVote = useCallback((song: searchResults) => {
    socket.emit("upVote", song);
  }, []);
  const handleDelete = useCallback((song: searchResults) => {
    socket.emit("deleteSong", song);
  }, []);
  const handleUpVote = useDebounce(upVote, 300);

  const triggerUpVote = useCallback(
    (e: React.MouseEvent, song: searchResults) => {
      {
        if (!user) return toast.error("Login required");
        e.stopPropagation();
        handleUpVote(song);

        try {
          setQueue((prev) => {
            const songExists = prev.find((item) => item.id === song.id);

            if (songExists) {
              // If the song is already in the queue, toggle the isVoted state
              return prev.map((item) =>
                item.id === song.id
                  ? {
                      ...item,
                      isVoted: !item.isVoted, // Toggle isVoted
                      topVoters:
                        item.isVoted &&
                        item.topVoters &&
                        item.topVoters.length > 0
                          ? item.topVoters.filter(
                              (voter) => voter?._id !== user?._id
                            ) // Remove user if unvoted
                          : [...(item.topVoters || []), user], // Add user if voted
                      addedByUser: user, // Update addedByUser only when voting
                    }
                  : item
              );
            } else {
              // If the song is not in the queue, add it with isVoted set to true and add user to topVoters
              return [
                ...prev,
                {
                  ...song,
                  isVoted: true,
                  topVoters: [user],
                  addedByUser: user,
                },
              ];
            }
          });
        } catch (error) {
          console.log(error);
        }
      }
    },
    [handleUpVote, setQueue, user]
  );
  return (
    <div className=" py-2 group-hover:opacity-100 flex flex-col overflow-y-scroll gap-4">
      {queue
        ?.filter((r) => r.id !== currentSong?.id)
        .map((song, i) => (
          <div key={i} className=" flex gap-2 items-center justify-between">
            <div className="relative">
              <Avatar className="size-12 rounded-md relative group">
                <AvatarImage
                  alt={song.name}
                  height={500}
                  width={500}
                  className="rounded-md group-hover:opacity-40 transition-all duration-500"
                  src={song.image[song.image.length - 1].url}
                />
                <AvatarFallback>SX</AvatarFallback>
                <Trash
                  onClick={() => handleDelete(song)}
                  className="absolute cursor-pointer top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                />
              </Avatar>
            </div>
            <div className="flex  flex-col flex-grow text-sm w-7/12">
              <TooltipProvider key={song.id}>
                <Tooltip>
                  <TooltipTrigger className=" w-auto text-start">
                    <p
                      onClick={(e) => {
                        e.stopPropagation(),
                          socket.emit("nextSong", {
                            nextSong: song,
                            callback: true,
                          });
                      }}
                      className="  cursor-pointer font-semibold truncate"
                    >
                      {song.name}
                    </p>
                  </TooltipTrigger>
                  <TooltipContent className="bg-[#9870d3] mb-2 text-white">
                    {song.addedByUser && (
                      <p>
                        Added by {song?.addedByUser?.name} (
                        {song?.addedByUser?.username})
                      </p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <p className="text-[#D0BCFF] truncate text-[12px]">
                {formatArtistName(song.artists.primary)}
              </p>
            </div>
            <div className=" flex flex-col self-end items-center gap-2">
              <Heart
                className={`${
                  song?.isVoted ? "fill-yellow-500 text-yellow-500" : ""
                } cursor-pointer`}
                onClick={(e) => triggerUpVote(e, song)}
              />
              <div className="flex -mt-1.5 text-xs items-center">
                <div className=" flex items-center">
                  {song.topVoters?.slice(0, 2).map((voter, i) => (
                    <TooltipProvider key={voter?._id}>
                      <Tooltip>
                        <TooltipTrigger>
                          <div className={` ${i !== 0 && "-ml-2.5"} size-6`}>
                            <Avatar className=" size-6 border border-white">
                              <AvatarImage
                                alt={voter?.name}
                                height={200}
                                width={200}
                                className=" rounded-full"
                                src={voter?.imageUrl}
                              />
                              <AvatarFallback>SX</AvatarFallback>
                            </Avatar>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent className="mr-44 bg-[#9870d3] mb-1 text-white">
                          <p>
                            {voter?.username} ({voter?.name})
                          </p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                  {song?.voteCount > 2 && (
                    <div
                      className={` -ml-4 pl-1.5 py-1 text-[9px] rounded-full`}
                    >
                      <Avatar className=" size-6 border-white border">
                        <AvatarFallback>+{song?.voteCount - 2}</AvatarFallback>
                      </Avatar>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );
}

export default QueueList;
