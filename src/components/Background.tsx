"use client";
import { useAudio } from "@/app/store/AudioContext";
import useSocket from "@/Hooks/useSocket";
import React from "react";

function Background() {
  useSocket();
  const { currentSong } = useAudio();
  return (
    <div
      style={{
        backgroundImage: `url('${
          currentSong?.image[currentSong?.image?.length - 1]?.url || "/bg.webp"
        }' ) `,
      }}
      className="h-dvh relative bg-cover transition-all duration-700 bg-center overflow-hidden md:flex flex-col items-center justify-center py-4 w-full"
    />
  );
}

export default Background;
