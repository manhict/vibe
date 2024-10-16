import { ArrowLeft, Loader2Icon, X } from "lucide-react";
import { FaYoutube } from "react-icons/fa";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { DialogClose } from "@radix-ui/react-dialog";
import { useUserContext } from "@/app/store/userStore";
import { useCallback, useRef, useState } from "react";
import api from "@/lib/api";
import { extractPlaylistID } from "@/utils/utils";
import { toast } from "sonner";
import { searchResults } from "@/lib/types";
import useDebounce from "@/Hooks/useDebounce";
import { socket } from "@/app/socket";
import { Input } from "../ui/input";
import SearchSongPopup from "../SearchSongPopup";
function Youtube() {
  const { roomId, setQueue, listener } = useUserContext();
  const [loading, setLoading] = useState<boolean>(false);

  const closeRef = useRef<HTMLButtonElement>(null);
  const loadPlaylist = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      const playlistuRL = e.target.value;
      if (playlistuRL.trim().length === 0) {
        return;
      }
      setLoading(true);

      const tracks = await api.get(
        `/api/youtube?id=${extractPlaylistID(
          playlistuRL
        )}&room=${roomId}&save=true`
      );
      if (tracks.success) {
        toast.success("Imported successfully");
        setQueue(tracks.data as searchResults[]);
        closeRef.current?.click();
        socket.emit("getSongQueue");
      }
      setLoading(false);
    },
    [roomId, setQueue]
  );
  const handleLoad = useDebounce(loadPlaylist, 500);
  if (listener?.totalUsers == 1) {
    return (
      <Dialog>
        <DialogTrigger>
          <FaYoutube className="size-4" />
        </DialogTrigger>
        <DialogContent className="flex bg-transparent flex-col w-full overflow-hidden rounded-2xl gap-0 p-0 border-none max-w-2xl max-md:max-w-sm">
          <DialogHeader>
            <DialogTitle />
            <DialogDescription />
          </DialogHeader>
          <div className="bg-black rounded-t-xl flex items-center justify-between p-2.5 px-5">
            <DialogClose>
              <ArrowLeft className="text-zinc-500 cursor-pointer" />
            </DialogClose>
            <Input
              autoFocus
              onChange={handleLoad}
              placeholder="Paste youtube playlist url"
              className="border-none focus-visible:ring-0"
            />
            <DialogClose ref={closeRef}>
              {loading ? (
                <Loader2Icon className="text-zinc-500 animate-spin" />
              ) : (
                <X className="text-zinc-500 cursor-pointer" />
              )}
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  return <SearchSongPopup youtube />;
}

export default Youtube;
