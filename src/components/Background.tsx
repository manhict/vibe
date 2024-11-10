"use client";
import useCache from "@/Hooks/useCache";
import { useAudio } from "@/store/AudioContext";
import { useUserContext } from "@/store/userStore";

function Background() {
  const { showVideo } = useUserContext();
  const { currentSong, backgroundVideoRef } = useAudio();
  useCache();

  return (
    <div className="h-dvh relative overflow-hidden md:flex flex-col items-center justify-center w-full">
      {currentSong?.source == "youtube" ? (
        <>
          {showVideo ? (
            <video
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
            />
          )}
        </>
      ) : (
        <div
          className="relative bg-cover  object-cover transition-all duration-700 bg-center w-full h-full"
          style={{
            backgroundImage: `url('${
              currentSong?.image[currentSong?.image?.length - 1]?.url ||
              "/bg.webp"
            }')`,
          }}
        />
      )}
    </div>
  );
}

export default Background;
