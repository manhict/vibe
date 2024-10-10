"use client";
import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import { Button } from "@/components/ui/button";
import { formatArtistName } from "@/utils/utils";
import { Heart, Search, Share2, Trash } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import useSocket from "@/Hooks/useSocket";
import { socket } from "@/app/socket";
import { searchResults } from "@/lib/types";
import useDebounce from "@/Hooks/useDebounce";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function AddToQueue() {
  const { queue, roomId, listener, user, setQueue } = useUserContext();
  const { currentSong } = useAudio();
  useSocket();
  const handleShare = useCallback(() => {
    if (!user) return;
    try {
      navigator
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
  const upVote = useCallback((song: searchResults) => {
    socket.emit("upVote", song);
  }, []);
  const handleDelete = useCallback((song: searchResults) => {
    socket.emit("deleteSong", song);
  }, []);
  const handleUpVote = useDebounce(upVote, 400);
  return (
    <div className=" select-none max-md:rounded-none max-md:border-t-0 backdrop-blur-lg  max-h-full border flex flex-col gap-2 max-md:w-full border-[#49454F] w-[45%] rounded-xl p-4">
      <div className=" flex items-center justify-between">
        <p className=" text-lg font-semibold">In Queue</p>
        <div className=" flex items-center">
          {/* <Input className=" bg-[#8D50F9] rounded-md rounded-r-none" /> */}
          <Button
            variant={"secondary"}
            className=" bg-[#8D50F9] p-2.5 rounded-md"
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
      <div className="h-full z-50 overflow-y-scroll">
        <div className=" py-2 flex flex-col overflow-y-scroll gap-4">
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
                  <p
                    onClick={(e) => {
                      e.stopPropagation(),
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
                <div className=" flex flex-col self-end items-center gap-2">
                  <Heart
                    className={`${
                      song?.isVoted ? "fill-yellow-500 text-yellow-500" : ""
                    } cursor-pointer`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleUpVote(song);

                      setQueue((prev) => {
                        const songExists = prev.find(
                          (item) => item.id === song.id
                        );

                        if (songExists) {
                          // If the song is already in the queue, update it
                          return prev.map((item) =>
                            item.id === song.id
                              ? { ...item, isVoted: !item.isVoted } // Toggle isVoted
                              : item
                          );
                        } else {
                          // If the song is not in the queue, add it with isVoted set to true
                          return [...prev, { ...song, isVoted: true }];
                        }
                      });
                    }}
                  />
                  <div className="flex -mt-1.5 text-xs items-center">
                    <div className=" flex items-center">
                      {song.topVoters?.slice(0, 2).map((voter, i) => (
                        <TooltipProvider key={voter?._id}>
                          <Tooltip>
                            <TooltipTrigger>
                              <div
                                className={` ${i !== 0 && "-ml-2.5"} size-6`}
                              >
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
                      {song.voteCount && song.voteCount > 2 && (
                        <div
                          className={` -ml-4 px-2 py-1 text-[9px] rounded-full`}
                        >
                          <Avatar className=" size-6 border-white border">
                            <AvatarFallback>
                              +{song?.voteCount - 2}
                            </AvatarFallback>
                          </Avatar>
                        </div>
                      )}
                    </div>
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
                ?.filter((r) => r.userId?._id !== user?._id)
                ?.map((roomUser, i) => (
                  <TooltipProvider key={roomUser?._id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={` ${i !== 0 && "-ml-2"} size-6`}>
                          <Avatar className=" size-6 border border-white">
                            <AvatarImage
                              alt={roomUser?.userId?.name}
                              height={200}
                              width={200}
                              className=" rounded-full"
                              src={roomUser?.userId?.imageUrl}
                            />
                            <AvatarFallback>SX</AvatarFallback>
                          </Avatar>
                        </div>
                      </TooltipTrigger>
                      <TooltipContent className=" bg-[#9870d3] mb-1 text-white">
                        <p>
                          {roomUser?.userId?.username} ({roomUser?.userId?.name}
                          )
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}
            {listener && listener?.totalUsers > 5 && (
              <div className={` -ml-4 px-2 py-1 text-[9px]  rounded-full`}>
                <Avatar className=" size-6 border-white border">
                  <AvatarFallback>
                    {" "}
                    +
                    {listener?.totalUsers > 100 ? 99 : listener?.totalUsers - 5}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
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
