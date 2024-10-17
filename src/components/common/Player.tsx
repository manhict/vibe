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

    playNext,
    playPrev,
    seek,
    volume,
    setVolume,
    setProgress,
    isLooped,
    setLoop,
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
                  className={`${
                    user?.role !== "admin" ? "text-zinc-700" : ""
                  } cursor-pointer size-5 rotate-180`}
                  width="21"
                  height="16"
                  viewBox="0 0 21 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                    fill="#EADDFF"
                  />
                  <path
                    d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                    fill="#EADDFF"
                    fillOpacity="0.5"
                  />
                </svg>

                <PlayButton />

                <svg
                  onClick={playNext}
                  aria-label="play next"
                  className={`${
                    user?.role !== "admin" ? "text-zinc-700" : ""
                  } cursor-pointer size-5`}
                  width="21"
                  height="16"
                  viewBox="0 0 21 16"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                    fill="#EADDFF"
                  />
                  <path
                    d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                    fill="#EADDFF"
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
              {/* <Shuffle className=" size-5" /> */}
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
