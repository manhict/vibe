"use client";
import { useAudio } from "@/app/store/AudioContext";
import { formatArtistName, formatElapsedTime } from "@/utils/utils";
import {
  MessageSquare,
  Pause,
  Play,
  Repeat,
  SkipBack,
  SkipForward,
  Volume1,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
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
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { AnimatePresence, motion } from "framer-motion";
import { socket } from "@/app/socket";
function Player() {
  const { user, listener, messages } = useUserContext();
  const {
    currentSong,
    progress,
    duration,
    togglePlayPause,
    isPlaying,
    playNext,
    playPrev,
    seek,
    volume,
    setVolume,
  } = useAudio();

  const [formattedProgress, setFormattedProgress] = useState<string>("0:00");
  const [formattedDuration, setFormattedDuration] = useState<string>("0:00");
  const [isChatOpen, setIsChatOpen] = useState(false);
  useEffect(() => {
    setFormattedProgress(formatElapsedTime(progress));
    setFormattedDuration(formatElapsedTime(duration));
  }, [progress, duration]);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);
    if (user?.role !== "admin")
      return toast.error("Only admin is allowed to seek");
    seek(newTime);
  };
  const chatVariants = {
    hidden: { y: "100%" },
    visible: { y: 0 },
  };
  const [message, setMessage] = useState<string>("");
  const sendMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (String(message).trim().length == 0) return;
      socket.emit("message", message);
      setMessage("");
    },
    [message]
  );

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

  return (
    <div className=" relative select-none overflow-hidden w-1/2 backdrop-blur-lg h-full border border-[#49454F] flex-grow rounded-xl p-7 py-11 flex flex-col items-center justify-center gap-[2.5dvh]">
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
            <div className=" flex  p-5 justify-between items-center">
              <div className=" flex w-9/12 truncate items-center gap-1.5">
                <Avatar className=" rounded-md size-14">
                  <AvatarImage
                    alt={currentSong?.name || ""}
                    height={300}
                    width={300}
                    className=" h-full object-cover  w-full"
                    src={
                      currentSong?.image[currentSong.image.length - 1].url ||
                      "/cache.jpg"
                    }
                  />
                </Avatar>
                <div className=" truncate">
                  <p className=" truncate text-base">{currentSong?.name}</p>
                  <p className="truncate text-xs">
                    {(currentSong &&
                      formatArtistName(currentSong?.artists.primary)) ||
                      "Unknown"}
                  </p>
                </div>
              </div>
              <div>
                <div className=" flex items-center w-fit gap-2">
                  <SkipBack
                    onClick={playPrev}
                    aria-label="play prev"
                    className={`${
                      user?.role !== "admin" ? "text-zinc-700" : ""
                    } cursor-pointer size-4`}
                  />
                  <div
                    onClick={togglePlayPause}
                    className=" bg-[#8D50F9] cursor-pointer p-4 rounded-full"
                  >
                    {isPlaying ? (
                      <Pause className=" size-4" />
                    ) : (
                      <Play className=" size-4" />
                    )}
                  </div>
                  <SkipForward
                    onClick={playNext}
                    aria-label="play next"
                    className={`${
                      user?.role !== "admin" ? "text-zinc-700" : ""
                    } cursor-pointer size-4`}
                  />
                </div>
              </div>
            </div>

            <div className=" flex py-2 px-5 text-2xl font-semibold bg-white/10 w-full justify-between items-center">
              <p>Chat</p>
              <div className=" flex items-center">
                {user &&
                  listener?.roomUsers
                    ?.filter((r) => r.userId?._id !== user?._id)
                    ?.map((roomUser, i) => (
                      <TooltipProvider key={roomUser?._id}>
                        <Tooltip>
                          <TooltipTrigger>
                            <div className={` ${i !== 0 && "-ml-2"} size-7`}>
                              <Avatar className=" size-7">
                                <AvatarImage
                                  alt={roomUser?.userId?.name}
                                  height={200}
                                  width={200}
                                  className=" rounded-full"
                                  src={roomUser?.userId?.imageUrl}
                                />
                              </Avatar>
                            </div>
                          </TooltipTrigger>
                          <TooltipContent className=" bg-[#9870d3] mb-1 text-white">
                            <p>
                              {roomUser?.userId?.username} (
                              {roomUser?.userId?.name})
                            </p>
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    ))}
                {listener && listener?.totalUsers > 4 && (
                  <div className={` -ml-4 px-2 py-1 text-[9px]  rounded-full`}>
                    <Avatar className=" size-7 border-white border">
                      <AvatarFallback>
                        {" "}
                        +
                        {listener?.totalUsers > 100
                          ? 99
                          : listener?.totalUsers - 4}
                      </AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
              <X
                onClick={() => setIsChatOpen(false)}
                className=" cursor-pointer"
              />
            </div>
            <div className="  h-full overflow-y-scroll px-5 pb-4 flex flex-col justify-between ">
              <div className=" flex-grow gap-4 flex flex-col py-6 overflow-y-scroll">
                {user &&
                  messages.map((message) => (
                    <div ref={messagesEndRef} key={message.message}>
                      {message.user._id !== user?._id ? (
                        <div className=" flex gap-2">
                          <Avatar className="size-9">
                            <AvatarImage
                              alt={message.user?.name || ""}
                              height={50}
                              width={50}
                              className=" h-full object-cover  w-full"
                              src={message?.user.imageUrl || "/bg.webp"}
                            />
                          </Avatar>
                          <div className=" w-full">
                            <p className=" truncate -mt-0.5 border-white w-5/12 font-semibold mb-1.5">
                              {message.user?.name}
                            </p>
                            <p className=" w-fit max-w-7/12 bg-white/20 text-sm px-4 py-1 rounded-md rounded-tl-none">
                              {message.message}
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className=" flex w-full self-end gap-2">
                          <div className=" w-full flex flex-col justify-end items-end">
                            <p className=" truncate -mt-0.5 text-end font-semibold mb-1.5 w-5/12">
                              {message.user?.name}
                            </p>
                            <p className=" w-fit max-w-7/12 bg-white/20 text-sm px-4 py-1 rounded-md rounded-tr-none">
                              {message.message}
                            </p>
                          </div>
                          <Avatar className="size-9">
                            <AvatarImage
                              alt={message.user?.name || ""}
                              height={50}
                              width={50}
                              className=" h-full object-cover  w-full"
                              src={message.user?.imageUrl || "/bg.webp"}
                            />
                          </Avatar>
                        </div>
                      )}
                    </div>
                  ))}
              </div>
              <form onSubmit={sendMessage} className=" relative">
                <Input
                  onChange={(e) => setMessage(e.target.value)}
                  value={message}
                  name="message"
                  id="message"
                  type="text"
                  className=" bg-white/5 rounded-xl py-5 border border-white/20"
                  placeholder="Send Message"
                />
                <Button
                  size={"sm"}
                  className=" absolute right-1.5 top-1 bg-[#8D50F9]  hover:bg-[#8D50F9] text-white rounded-lg px-4"
                >
                  Send
                </Button>
              </form>
            </div>
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
            <div className=" h-auto  overflow-hidden rounded-xl">
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
            </div>
            <div className=" text-center w-full items-center justify-center flex flex-col text-sm">
              <p className=" text-xl font-medium w-60 truncate">
                {currentSong?.name || "Not Playing"}
              </p>
              <p className=" w-56 text-zinc-200 truncate">
                {(currentSong &&
                  formatArtistName(currentSong?.artists.primary)) ||
                  "Unknown"}
              </p>
            </div>
            <div className="flex items-center w-full justify-center gap-4">
              <div className=" flex items-center w-fit gap-2">
                <SkipBack
                  onClick={playPrev}
                  aria-label="play prev"
                  className={`${
                    user?.role !== "admin" ? "text-zinc-700" : ""
                  } cursor-pointer size-5`}
                />
                <div
                  onClick={togglePlayPause}
                  className=" bg-[#8D50F9] cursor-pointer p-4 rounded-full"
                >
                  {isPlaying ? (
                    <Pause className=" size-5" />
                  ) : (
                    <Play className=" size-5" />
                  )}
                </div>
                <SkipForward
                  onClick={playNext}
                  aria-label="play next"
                  className={`${
                    user?.role !== "admin" ? "text-zinc-700" : ""
                  } cursor-pointer size-5`}
                />
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
            <div className=" flex items-center gap-4 px-4 w-full text-xs">
              <p>{formattedProgress}</p>
              <input
                type="range"
                max={duration || 0}
                value={progress || 0}
                onChange={handleSeek}
                className="w-full h-1.5 bg-zinc-200/20 transition-all duration-300 overflow-hidden rounded-lg appearance-none cursor-pointer"
                aria-label="Seek control"
              />
              <p>{formattedDuration}</p>
            </div>
            <div className=" flex text-zinc-600 gap-3 items-center">
              <Repeat className=" size-5 text-zinc-600" />
              {/* <Shuffle className=" size-5" /> */}
              <MessageSquare
                onClick={() => setIsChatOpen(true)}
                className={`${
                  seen ? "" : "text-red-500"
                } size-5 cursor-pointer hover:text-zinc-200 transition-all duration-500`}
              />
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
                          <Avatar className=" size-6">
                            <AvatarImage
                              alt={voter?.name}
                              height={200}
                              width={200}
                              className=" rounded-full"
                              src={voter?.imageUrl}
                            />
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
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Player;
