import api from "@/lib/api";
import { emitMessage } from "@/lib/customEmits";
import { searchResults } from "@/lib/types";
import { useCallback } from "react";
import { toast } from "sonner";

function useAddSong() {
  const addSong = useCallback(
    async (selectedSongs: searchResults[], roomId?: string | null) => {
      if (!roomId) return;
      toast.loading("Adding songs to queue", { id: "adding" });
      const added = await api.post(
        `${process.env.SOCKET_URI}/api/add?room=${roomId}`,
        selectedSongs
      );
      if (added.success) {
        emitMessage("update", "update");
        toast.success("Songs added to queue");
      }
      toast.dismiss("adding");
    },
    []
  );

  return { addSong };
}

export default useAddSong;
