"use client";
import { useAudio } from "@/app/store/AudioContext";
import { formatArtistName, formatElapsedTime } from "@/utils/utils";
import { MessageSquare, Repeat, Volume1, Volume2, VolumeX } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import VolumeControl from "./VolumeControl";
import { useUserContext } from "@/app/store/userStore";
import Image from "next/image";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { toast } from "sonner";
import { AnimatePresence, motion } from "framer-motion";
import Chat from "./Chat";
import Listeners from "./Listeners";
import { Slider } from "../ui/slider";
import LikeButton from "./LinkeButton";
import { socket } from "@/app/socket";
import useDebounce from "@/Hooks/useDebounce";
import parse from "html-react-parser";
import PlayButton from "./PlayButton";
function Player() {
  const { user, messages } = useUserContext();
  const {
    currentSong,
    progress,
    duration,
    shuffled,
    playNext,
    playPrev,
    seek,
    volume,
    setVolume,
    setProgress,
    isLooped,
    setLoop,
    setShuffled,
  } = useAudio();

  const [formattedProgress, setFormattedProgress] = useState<string>("0:00");
  const [formattedDuration, setFormattedDuration] = useState<string>("0:00");
  const [isChatOpen, setIsChatOpen] = useState(false);
  useEffect(() => {
    setFormattedProgress(formatElapsedTime(progress));
    setFormattedDuration(formatElapsedTime(duration));
  }, [progress, duration]);

  const handleSeek = (e: number[]) => {
    if (e[0]) {
      if (user && user.role !== "admin") {
        return toast.error("Only admin is allowed to seek");
      }
      seek(e[0]);
    }
  };

  const chatVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [seen, setSeen] = useState<boolean>(true);
  useEffect(() => {
    if (isChatOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });

      setSeen(true);
    } else {
      if (messagesEndRef.current) {
        setSeen(true);
      }
    }
  }, [messages, isChatOpen]);
  useEffect(() => {
    if (messages.length > 0) {
      setSeen(false);
    }
  }, [messages]);

  const handleProgress = useCallback(
    (value: number[]) => {
      if (value && value[0] !== undefined) {
        if (user?.role !== "admin") {
          return toast.error("Only admin is allowed to seek");
        }
        setProgress(value[0]);
      }
    },
    [setProgress, user]
  );

  const handleValueChange = useCallback(
    (e: React.MouseEvent) => {
      if (user?.role !== "admin") {
        return toast.error("Only admin is allowed to seek");
      }
      const rect = e.currentTarget.getBoundingClientRect();
      const clickPosition = e.clientX - rect.left;
      const newProgress = (clickPosition / rect.width) * duration;
      setProgress(newProgress);
      seek(newProgress);
    },
    [duration, seek, setProgress, user]
  );
  const loop = useCallback(() => {
    if (user?.role === "admin") {
      if (!currentSong) return;
      socket.emit("loop", !isLooped);
      return;
    }
    toast.warning("Only admin can Loop");
  }, [user, isLooped, currentSong]);
  const handleLoop = useDebounce(loop, 500);
  const shuffle = useCallback(() => {
    if (user?.role === "admin") {
      if (!currentSong) return;
      socket.emit("shuffle", !isLooped);
      return;
    }
    toast.warning("Only admin can Loop");
  }, [user, isLooped, currentSong]);
  const handleShuffle = useDebounce(shuffle, 500);

  return (
    <div className=" relative hide-scrollbar max-md:w-full max-md:rounded-none max-md:border-none overflow-y-scroll w-1/2 backdrop-blur-lg h-full border border-[#49454F] flex-grow rounded-xl p-7 py-11 flex flex-col items-center justify-center gap-[2.5dvh]">
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial="hidden"
            animate="visible"
            exit="hidden"
            variants={chatVariants}
            transition={{
              type: "spring",
              stiffness: 100,
              damping: 20,
            }}
            className=" h-full flex flex-col py-2 w-full absolute  backdrop-blur-xl bg-black/10 inset-0"
          >
            <Chat
              //@ts-expect-error:ex
              messagesEndRef={messagesEndRef}
              setIsChatOpen={setIsChatOpen}
            />
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {!isChatOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="w-full h-full flex flex-col items-center justify-center gap-[2.5dvh]"
          >
            <div className=" relative h-auto min-h-40  overflow-hidden rounded-xl">
              <Image
                alt={currentSong?.name || ""}
                height={300}
                width={300}
                className=" h-full object-cover  w-full"
                src={
                  currentSong?.image[currentSong.image.length - 1].url ||
                  "/cache.jpg"
                }
              />
              {currentSong?.source == "youtube" && (
                <p className=" absolute bottom-2 right-2 text-xl mt-1 text-[#a176eb]">
                  ☆
                </p>
              )}
            </div>
            <div className=" text-center w-full -mt-2 items-center justify-center flex flex-col text-sm">
              <p className=" text-xl font-medium w-60 truncate">
                {parse(currentSong?.name || "Not Playing")}
              </p>
              <p className=" w-56 text-zinc-200 truncate">
                {(currentSong &&
                  formatArtistName(currentSong?.artists?.primary)) ||
                  "Unknown"}
              </p>
            </div>
            <div className="flex items-center w-full justify-center gap-4">
              <div className=" flex items-center w-fit gap-2">
                <svg
                  onClick={playPrev}
                  aria-label="play prev"
                  className="cursor-pointer size-5 rotate-180"
                  width="21"
                  height="16"
                  viewBox="0 0 21 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                    fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                  />
                  <path
                    d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                    fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                    fillOpacity="0.5"
                  />
                </svg>

                <PlayButton />

                <svg
                  onClick={playNext}
                  aria-label="play next"
                  className="cursor-pointer size-5"
                  width="21"
                  height="16"
                  viewBox="0 0 21 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                    fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                  />
                  <path
                    d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                    fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                    fillOpacity="0.5"
                  />
                </svg>
              </div>
              <div className="text-sm cursor-pointer gap-1.5 w-[30%] items-center flex">
                {volume == 0 ? (
                  <VolumeX onClick={() => setVolume(0.5)} className=" size-6" />
                ) : volume < 0.5 ? (
                  <Volume1 onClick={() => setVolume(0)} className="size-6" />
                ) : (
                  <Volume2 onClick={() => setVolume(0)} className="size-6" />
                )}

                <VolumeControl />
              </div>
            </div>
            <div className=" select-none flex items-center gap-4 px-4 w-full text-xs">
              <p>{formattedProgress}</p>

              <Slider
                max={duration || 0}
                value={[progress]}
                disabled={user?.role !== "admin"}
                onClick={handleValueChange}
                onValueCommit={handleSeek}
                onValueChange={handleProgress}
              />

              <p>{formattedDuration}</p>
            </div>
            <div className=" flex text-zinc-600 gap-3 items-center">
              <Repeat
                onClick={() => (setLoop(!isLooped), handleLoop())}
                className={`${
                  isLooped ? "text-zinc-100" : "text-zinc-600"
                } size-5 cursor-pointer transition-all duration-300`}
              />

              <svg
                onClick={() => (setShuffled(!shuffle), handleShuffle())}
                width="25"
                height="25"
                viewBox="0 0 25 25"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M22.7806 17.1576C22.8504 17.2273 22.9057 17.31 22.9434 17.4011C22.9812 17.4921 23.0006 17.5897 23.0006 17.6883C23.0006 17.7868 22.9812 17.8844 22.9434 17.9755C22.9057 18.0665 22.8504 18.1492 22.7806 18.2189L20.5306 20.4689C20.4257 20.5739 20.292 20.6454 20.1465 20.6744C20.0009 20.7034 19.85 20.6886 19.7129 20.6317C19.5758 20.5749 19.4586 20.4787 19.3762 20.3553C19.2938 20.2318 19.2499 20.0867 19.25 19.9383V18.4383C18.1908 18.4234 17.1499 18.16 16.2111 17.6692C15.2724 17.1784 14.462 16.4739 13.8453 15.6126L9.93406 10.1376C9.44789 9.45803 8.80677 8.90403 8.06382 8.52155C7.32088 8.13907 6.49749 7.93913 5.66188 7.93827H3.5C3.30109 7.93827 3.11032 7.85926 2.96967 7.7186C2.82902 7.57795 2.75 7.38719 2.75 7.18827C2.75 6.98936 2.82902 6.7986 2.96967 6.65794C3.11032 6.51729 3.30109 6.43827 3.5 6.43827H5.66188C6.73615 6.43917 7.79474 6.69603 8.74996 7.18758C9.70518 7.67912 10.5295 8.39121 11.1547 9.26484L15.0659 14.7398C15.5434 15.4074 16.1704 15.954 16.897 16.3357C17.6235 16.7175 18.4294 16.9238 19.25 16.9383V15.4383C19.2499 15.2899 19.2938 15.1447 19.3762 15.0213C19.4586 14.8978 19.5758 14.8016 19.7129 14.7448C19.85 14.688 20.0009 14.6731 20.1465 14.7021C20.292 14.7311 20.4257 14.8026 20.5306 14.9076L22.7806 17.1576ZM13.9062 10.4695C13.9864 10.5268 14.077 10.5677 14.173 10.5899C14.2689 10.6121 14.3683 10.6152 14.4655 10.599C14.5626 10.5828 14.6557 10.5477 14.7392 10.4955C14.8228 10.4434 14.8953 10.3753 14.9525 10.2951L15.065 10.1386C15.5423 9.47052 16.1695 8.92353 16.8962 8.54143C17.6229 8.15934 18.4291 7.95277 19.25 7.93827V9.43827C19.2499 9.5867 19.2938 9.73182 19.3762 9.85526C19.4586 9.97871 19.5758 10.0749 19.7129 10.1317C19.85 10.1886 20.0009 10.2034 20.1465 10.1744C20.292 10.1454 20.4257 10.0739 20.5306 9.9689L22.7806 7.7189C22.8504 7.64924 22.9057 7.56653 22.9434 7.47548C22.9812 7.38443 23.0006 7.28684 23.0006 7.18827C23.0006 7.08971 22.9812 6.99212 22.9434 6.90107C22.9057 6.81002 22.8504 6.7273 22.7806 6.65765L20.5306 4.40765C20.4257 4.30264 20.292 4.23111 20.1465 4.20213C20.0009 4.17314 19.85 4.18799 19.7129 4.24481C19.5758 4.30162 19.4586 4.39784 19.3762 4.52129C19.2938 4.64473 19.2499 4.78985 19.25 4.93827V6.43827C18.1908 6.45315 17.1499 6.7166 16.2111 7.20739C15.2724 7.69818 14.462 8.4026 13.8453 9.2639L13.7328 9.42046C13.6751 9.50064 13.6338 9.59145 13.6112 9.68765C13.5887 9.78385 13.5854 9.88356 13.6015 9.98104C13.6176 10.0785 13.6528 10.1719 13.7051 10.2557C13.7574 10.3395 13.8258 10.4122 13.9062 10.4695ZM11.0938 14.407C11.0136 14.3498 10.923 14.3089 10.827 14.2867C10.7311 14.2644 10.6317 14.2613 10.5345 14.2775C10.4374 14.2937 10.3443 14.3289 10.2608 14.381C10.1772 14.4332 10.1047 14.5013 10.0475 14.5814L9.935 14.738C9.44883 15.4179 8.80761 15.9721 8.06448 16.3548C7.32136 16.7374 6.49773 16.9375 5.66188 16.9383H3.5C3.30109 16.9383 3.11032 17.0173 2.96967 17.1579C2.82902 17.2986 2.75 17.4894 2.75 17.6883C2.75 17.8872 2.82902 18.078 2.96967 18.2186C3.11032 18.3593 3.30109 18.4383 3.5 18.4383H5.66188C6.73615 18.4374 7.79474 18.1805 8.74996 17.689C9.70518 17.1974 10.5295 16.4853 11.1547 15.6117L11.2672 15.4551C11.3248 15.375 11.366 15.2843 11.3884 15.1882C11.4109 15.0921 11.4142 14.9925 11.398 14.8951C11.3819 14.7977 11.3468 14.7045 11.2945 14.6207C11.2423 14.537 11.1741 14.4644 11.0938 14.407Z"
                  className={`${
                    shuffled ? "fill-zinc-100" : "fill-zinc-600"
                  } size-5 cursor-pointer transition-all duration-300`}
                />
              </svg>

              <MessageSquare
                onClick={() => setIsChatOpen(true)}
                className={`${
                  seen ? "" : "text-red-500"
                } size-5 cursor-pointer hover:text-zinc-200 transition-all duration-500`}
              />
              <LikeButton hearts={["❤️", "💛", "😍", "🥰", "🥳"]} />
            </div>
            <div className=" w-full flex gap-2 min-h-5 items-center justify-center">
              {currentSong?.topVoters && currentSong.topVoters.length > 0 && (
                <p>Requested by</p>
              )}
              <div className=" flex items-center justify-center">
                {currentSong?.topVoters?.map((voter, i) => (
                  <TooltipProvider key={voter._id}>
                    <Tooltip>
                      <TooltipTrigger>
                        <div className={` ${i !== 0 && "-ml-2"} size-5`}>
                          <Avatar className=" size-6 border border-white">
                            <AvatarImage
                              loading="lazy"
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
                      <TooltipContent className="mr-20 bg-[#9870d3] mb-1 text-white">
                        <p>
                          {voter?.username} ({voter?.name})
                        </p>
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                ))}

                {currentSong && currentSong.voteCount > 4 && (
                  <div className={` -ml-4 px-2 py-1 text-[9px] rounded-full`}>
                    <Avatar className=" size-6 border-white border">
                      <AvatarFallback>
                        +{currentSong?.voteCount - 4}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            </div>
            <Listeners className=" max-md:flex hidden mt-10 -mb-10" />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Player;
