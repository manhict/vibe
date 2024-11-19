import api from "@/lib/api";
import { emitMessage } from "@/lib/customEmits";
import { searchResults } from "@/lib/types";
import { useUserContext } from "@/store/userStore";
import { useCallback } from "react";
import { toast } from "sonner";

function useAddSong() {
  const { queue } = useUserContext();
  const addSong = useCallback(
    async (
      selectedSongs: searchResults[],
      roomId?: string | null,
      check: boolean = true
    ) => {
      if (!roomId) return;
      let uniqueSongs: searchResults[] = [];
      if (check) {
        const queuedSongIds = new Set(queue.map((song) => song.id));
        uniqueSongs = selectedSongs.filter(
          (song) => !queuedSongIds.has(song.id)
        );

        if (uniqueSongs.length === 0) {
          toast.info("No new songs to add to the queue.");
          return;
        }
      }

      toast.loading("Adding songs to queue", { id: "adding" });
      const added = await api.post(
        `${process.env.SOCKET_URI}/api/add?room=${roomId}`,
        check ? uniqueSongs : selectedSongs
      );
      if (added.success) {
        emitMessage("update", "update");
        toast.success(`Songs added to  ${check ? "queue" : roomId}`);
      }
      toast.dismiss("adding");
    },
    [queue]
  );

  return { addSong };
}

export default useAddSong;
