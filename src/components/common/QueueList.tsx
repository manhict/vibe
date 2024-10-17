import { useAudio } from "@/app/store/AudioContext";
import { useUserContext } from "@/app/store/userStore";
import { formatArtistName } from "@/utils/utils";
import { Trash } from "lucide-react";
import { useCallback } from "react";
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
import parse from "html-react-parser";
import { MdDone } from "react-icons/md";
import VoteIcon from "./VoteIcon";
function QueueList({
  name = "",
  isDeleting = false,
  handleSelect,
  selectedSongs,
}: {
  name?: string;
  isDeleting?: boolean;
  handleSelect: (song: searchResults, limit: boolean) => void;
  selectedSongs: searchResults[];
}) {
  const { queue, setQueue, user } = useUserContext();
  const { currentSong } = useAudio();

  const upVote = useCallback((song: searchResults) => {
    socket.emit("upVote", song);
  }, []);
  const handleDelete = useCallback(
    (song: searchResults) => {
      if (isDeleting) return;
      socket.emit("deleteSong", song);
      if (user?.role == "admin") {
        setQueue((prev) => prev.filter((s) => s.id !== song.id));
      }
    },
    [setQueue, user, isDeleting]
  );
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

  const handlePlay = useCallback(
    (e: React.MouseEvent, song: searchResults) => {
      if (isDeleting) return;
      e.stopPropagation();
      socket.emit("nextSong", {
        nextSong: song,
        callback: true,
      });
    },
    [isDeleting]
  );

  return (
    <div className=" py-2 pr-2 group-hover:opacity-100 flex flex-col hover-scroll overflow-y-scroll gap-4">
      {queue
        ?.filter((r) => r.id !== currentSong?.id)
        ?.filter((s) => s.name.toLowerCase().startsWith(name.toLowerCase()))
        ?.map((song, i) => (
          <label
            htmlFor={song?.id + i}
            key={i}
            className=" flex gap-2  items-center justify-between"
          >
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
            <div className="flex flex-col flex-grow text-sm w-6/12">
              <TooltipProvider key={song.id}>
                <Tooltip>
                  <TooltipTrigger className=" w-auto text-start">
                    <p
                      onClick={(e) => handlePlay(e, song)}
                      className="  cursor-pointer font-semibold truncate"
                    >
                      {parse(song.name)}
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
            {isDeleting ? (
              <div className=" relative mr-0.5">
                <input
                  onChange={() => handleSelect(song, false)}
                  checked={selectedSongs.includes(song)}
                  name={song?.id + i}
                  id={song?.id + i}
                  type="checkbox"
                  className="peer cursor-pointer appearance-none w-5 h-5 border border-gray-400 rounded-sm checked:bg-purple-700 checked:border-purple checked:bg-purple"
                />
                <MdDone className="hidden w-4 h-4 text-white absolute left-0.5 top-0.5 peer-checked:block" />
              </div>
            ) : (
              <div className=" flex flex-col  items-center gap-2">
                <VoteIcon song={song} triggerUpVote={triggerUpVote} />
              </div>
            )}
          </label>
        ))}
    </div>
  );
}

export default QueueList;
