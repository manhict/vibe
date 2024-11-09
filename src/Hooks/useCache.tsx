import { useAudio } from "@/store/AudioContext";
import { useUserContext } from "@/store/userStore";
import getURL, { cacheVideo } from "@/utils/utils";
import { useCallback, useEffect } from "react";

function useCache() {
  const { currentSong, videoRef, backgroundVideoRef } = useAudio();
  const { upNextSongs, showVideo } = useUserContext();

  const loadVideos = useCallback(async () => {
    if (!currentSong) return;
    const currentVideoUrl = getURL(currentSong);
    if (currentVideoUrl) {
      // const cachedCurrentSongUrl = await cacheVideo(
      //   currentVideoUrl,
      //   currentSong.id
      // );

      if (
        backgroundVideoRef?.current &&
        backgroundVideoRef?.current.src !== currentVideoUrl
      ) {
        backgroundVideoRef.current.src = currentVideoUrl;
      }
      if (
        videoRef?.current &&
        videoRef?.current.src !==
          currentVideoUrl.replace(
            process.env.VIDEO_STREAM_URI || "",
            "https://sstream.onrender.com/stream"
          )
      ) {
        videoRef.current.src = currentVideoUrl.replace(
          process.env.VIDEO_STREAM_URI || "",
          "https://sstream.onrender.com/stream"
        );
      }
    }
  }, [currentSong, videoRef, backgroundVideoRef]);

  const cacheUpNextSong = useCallback(async () => {
    for (const song of upNextSongs) {
      if (song.source !== "youtube") return;
      const videoUrl = getURL(song);
      if (videoUrl) {
        await cacheVideo(videoUrl, song.id);
      }
    }
  }, [upNextSongs]);
  useEffect(() => {
    if (currentSong && currentSong.source == "youtube") {
      loadVideos();
    }
  }, [currentSong, loadVideos, showVideo]);

  useEffect(() => {
    if (upNextSongs.length > 0) {
      cacheUpNextSong();
    }
  }, [upNextSongs, cacheUpNextSong]);
  return;
}

export default useCache;
