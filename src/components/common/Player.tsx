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
} from "lucide-react";
import React, { useEffect, useState } from "react";
import VolumeControl from "./VolumeControl";
import { useUserContext } from "@/app/store/userStore";
import Image from "next/image";
function Player() {
  const { user } = useUserContext();
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

  useEffect(() => {
    setFormattedProgress(formatElapsedTime(progress));
    setFormattedDuration(formatElapsedTime(duration));
  }, [progress, duration]);

  const handleSeek = (event: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = Number(event.target.value);
    if (user?.role !== "admin") return;
    seek(newTime);
  };

  return (
    <div className=" select-none backdrop-blur-lg h-full border border-[#49454F] flex-grow rounded-xl p-7 py-11 flex flex-col items-center justify-center gap-[2.5dvh]">
      <div className=" h-auto  overflow-hidden rounded-xl">
        <Image
          alt={currentSong?.name || ""}
          height={300}
          width={300}
          className=" h-full object-cover  w-full"
          src={
            currentSong?.image[currentSong.image.length - 1].url || "/cache.jpg"
          }
        />
      </div>
      <div className=" text-center w-full items-center justify-center flex flex-col text-sm">
        <p className=" text-xl font-medium w-10/12 truncate">
          {currentSong?.name || "Not Playing"}
        </p>
        <p className=" w-10/12 text-zinc-200 truncate">
          {(currentSong && formatArtistName(currentSong?.artists.primary)) ||
            "Unknown"}
        </p>
      </div>

      <div className="flex items-center w-full  justify-center gap-2.5">
        <div className=" flex items-center w-fit gap-2.5">
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
        <div className="text-sm gap-1.5 w-[30%] items-center flex">
          {volume == 0 ? (
            <VolumeX onClick={() => setVolume(0.5)} className=" size-6" />
          ) : volume < 0.5 ? (
            <Volume1 className="size-6" />
          ) : (
            <Volume2 className="size-6" />
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
      <div className=" flex text-zinc-500 gap-3 items-center">
        <Repeat className=" size-5" />
        {/* <Shuffle className=" size-5" /> */}
        <MessageSquare className=" size-5" />
      </div>
    </div>
  );
}

export default Player;
