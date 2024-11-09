"use client";
import useCache from "@/Hooks/useCache";
import { useAudio } from "@/store/AudioContext";

function Background() {
  const { currentSong, backgroundVideoRef } = useAudio();
  useCache();

  return (
    <div className="h-dvh relative overflow-hidden md:flex flex-col items-center justify-center w-full">
      {currentSong?.source == "youtube" ? (
        <video
          //@ts-expect-error: missing
          ref={backgroundVideoRef}
          muted
          playsInline
          title={currentSong?.name || ""}
          height={300}
          width={300}
          className="relative bg-cover object-cover transition-all duration-700 bg-center w-full h-full"
        />
      ) : (
        <div
          className="relative bg-cover  object-cover transition-all duration-700 bg-center w-full h-full"
          style={{
            backgroundImage: `url('${
              currentSong?.image[currentSong?.image?.length - 1]?.url ||
              "/bg.webp"
            }')`,
          }}
        ></div>
      )}
    </div>
  );
}

export default Background;
