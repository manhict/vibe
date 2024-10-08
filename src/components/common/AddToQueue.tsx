"use client";
import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import { Button } from "@/components/ui/button";
import { formatArtistName } from "@/utils/utils";
import { Heart, Search, Share2 } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import Image from "next/image";

import useSocket from "@/Hooks/useSocket";
import { socket } from "@/app/socket";
import { searchResults } from "@/lib/types";
import useDebounce from "@/Hooks/useDebounce";
function AddToQueue() {
  const { queue, roomId, listener, user, upVotes, setUpVotes } =
    useUserContext();
  const { currentSong } = useAudio();
  useSocket();
  const handleShare = useCallback(() => {
    if (!user) return;
    try {
      navigator
        .share({
          url: window.location.origin + "/v/?room=" + roomId,
        })
        .then(() => {
          toast.success("Shared the link successfully!");
        });
    } catch (error: any) {
      toast.error(error.message);
    }
  }, [roomId, user]);
  const upVote = useCallback((song: searchResults) => {
    socket.emit("upVote", song);
  }, []);
  const handleUpVote = useDebounce(upVote, 400);
  return (
    <div className=" select-none backdrop-blur-lg  max-h-full border flex flex-col gap-2 border-[#49454F] w-[45%] rounded-xl p-4">
      <div className=" flex items-center justify-between">
        <p className=" text-lg font-semibold">In Queue</p>
        <div className=" flex items-center gap-1.5">
          <Button
            variant={"secondary"}
            className=" bg-[#8D50F9] p-2.5 trx rounded-md"
          >
            <Search className=" size-4" />
          </Button>
          {/* <Button
            variant={"secondary"}
            className=" bg-[#8D50F9] p-2.5 rounded-md"
          >
            <Plus className=" size-4" />
          </Button> */}
        </div>
      </div>
      <div className="h-full overflow-y-scroll">
        <div className="  py-2 flex flex-col overflow-hidden overflow-y-scroll gap-4">
          {queue
            ?.filter((r) => r.id !== currentSong?.id)
            .map((song, i) => (
              <div key={i} className=" flex gap-2 items-center justify-around">
                <div>
                  <div className="size-12 ">
                    <Image
                      alt={song.name}
                      height={500}
                      width={500}
                      className=" rounded-md"
                      src={song.image[song.image.length - 1].url}
                    />
                  </div>
                </div>
                <div className="flex z-10 flex-col text-sm w-8/12">
                  <p
                    onClick={() => {
                      socket.emit("nextSong", {
                        nextSong: song,
                        callback: true,
                      });
                    }}
                    className=" cursor-pointer font-semibold truncate"
                  >
                    {song.name}
                  </p>
                  <span className=" text-[#8D50F9] truncate text-[12px]">
                    {formatArtistName(song.artists.primary)}
                  </span>
                </div>
                <div className=" flex flex-col items-center gap-2">
                  <Heart
                    className={`${
                      song.queueId &&
                      upVotes.length > 0 &&
                      upVotes.find((r) => r.queueId == song.queueId) &&
                      "fill-yellow-500 text-yellow-500"
                    } cursor-pointer`}
                    onClick={() => {
                      handleUpVote(song);
                      if (song.queueId) {
                        setUpVotes((prev) => {
                          // Check if the song is already in the upVotes array to avoid duplicates
                          const isAlreadyVoted = prev.some(
                            (upVote) => upVote.queueId === song.queueId
                          );

                          // If not already voted, add it to the state
                          if (!isAlreadyVoted && song.queueId) {
                            return [...prev, { queueId: song.queueId }];
                          }

                          // Return previous state if the song is already voted or queueId is invalid
                          return prev.filter((r) => r.queueId !== song.queueId);
                        });
                      }
                    }}
                  />
                  <div className="flex text-xs items-center">
                    {/* <Avatar className="size-6 rounded-full">
                      <AvatarImage
                        src={song.image[song.image.length - 1].url}
                      />
                    </Avatar> */}
                    {song?.voteCount || 0}
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
      <div className=" flex items-center text-sm font-medium justify-between">
        <div className=" flex items-center gap-1">
          <p>Listening</p>

          <div className=" flex items-center">
            {user &&
              listener?.roomUsers
                ?.filter((r) => r.userId._id !== user._id)
                ?.slice(0, 3)
                ?.map((roomUser, i) => (
                  <TooltipProvider key={roomUser._id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={` ${i !== 0 && "-ml-2.5"} size-6`}>
                          <Image
                            alt={roomUser.userId.name}
                            height={200}
                            width={200}
                            className=" rounded-full"
                            src={roomUser.userId.imageUrl}
                          />
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className=" bg-[#9870d3] mb-1 text-white">
                        <p>{roomUser.userId.username}</p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
          </div>
        </div>
        <Button
          onClick={handleShare}
          size={"sm"}
          variant={"secondary"}
          className=" bg-[#8D50F9] hover:bg-[#7140c5]"
        >
          {" "}
          <Share2 className="size-4 mr-2" /> Invite Friends
        </Button>
      </div>
    </div>
  );
}

export default AddToQueue;
