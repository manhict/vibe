"use client";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2Icon, Search, Star, X } from "lucide-react";
import React, { useCallback, useEffect, useState } from "react";
import { MdDone } from "react-icons/md";
import { searchResults, searchSongResult } from "@/lib/types";
import api from "@/lib/api";
import useDebounce from "@/Hooks/useDebounce";
import { formatArtistName } from "@/utils/utils";
import { useInView } from "react-intersection-observer";
import { Dialog } from "@radix-ui/react-dialog";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { socket } from "@/app/socket";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import parse from "html-react-parser";
function SearchSongPopup({ isAddToQueue = false }: { isAddToQueue?: boolean }) {
  const [songs, setSongs] = useState<searchSongResult | null>(null);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const [query, setQuery] = useState<string>("");

  const search = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    setQuery(value);
    if (value.length <= 0) {
      setSongs(null);
      setLoading(false);
      return;
    }

    const url = `/api/search/?name=${value}&page=0`;

    setPage(0); // Reset page on a new search
    setLoading(true);
    const res = await api.get(url);
    if (res.success) {
      setSongs(res.data as searchSongResult);
    }
    setLoading(false);
  }, []);

  const handleSearch = useDebounce(search, 400);

  const searchMoreSongs = useCallback(async () => {
    if (!query || !songs || songs.data.results.length >= songs.data.total)
      return;

    setLoading(true);
    const url = `/api/search/?name=${query}&page=${page + 1}`;

    const res = await api.get(url);
    if (res.success) {
      setSongs((prevSongs) => ({
        ...prevSongs!,
        data: {
          ...prevSongs!.data,
          results: [
            ...prevSongs!.data.results,
            ...(res.data as searchSongResult).data.results,
          ],
        },
      }));
      setPage((prevPage) => prevPage + 1);
    }
    setLoading(false);
  }, [query, page, songs]);

  useEffect(() => {
    if (inView && !loading) {
      searchMoreSongs();
    }
  }, [inView, loading, searchMoreSongs]);
  const [selectedSongs, setSelectedSongs] = useState<searchResults[]>([]);

  const handlePlay = useCallback(async () => {
    if (selectedSongs.length == 0) return toast.error("No song selected");
    socket.emit("addToQueue", selectedSongs);
    setSelectedSongs([]);
  }, [selectedSongs]);

  const handleSelect = useCallback(
    async (song: searchResults) => {
      if (!song) return;
      if (selectedSongs.length >= 5)
        return toast.error("Limit reached only 5 songs at a time");

      if (selectedSongs.includes(song)) {
        // If the song is already selected (uncheck), remove it from the list
        setSelectedSongs(selectedSongs.filter((s) => s !== song));
      } else {
        // If the song is not selected (check), add it to the list
        setSelectedSongs([song, ...selectedSongs]);
      }
    },
    [selectedSongs]
  );

  return (
    <Dialog key={"songs"}>
      {!isAddToQueue ? (
        <DialogTrigger className="w-7/12 bg-black/70 border flex items-center px-4 gap-2 text-[#6750A4] rounded-full justify-between">
          <Search />
          <input
            type="text"
            readOnly
            className=" bg-transparent hidden md:flex font-medium text-white p-2 w-full outline-none"
            placeholder="What do you want to play next?"
          />
          <input
            type="text"
            readOnly
            className=" bg-transparent flex md:hidden font-medium text-white p-2 w-full outline-none"
            placeholder="Search songs"
          />
          <Star />
        </DialogTrigger>
      ) : (
        <DialogTrigger className="flex-col hidden md:flex w-full h-full text-zinc-200 justify-center items-center">
          <p className=" font-semibold text-4xl ">Seems like</p>
          <p className=" font-medium text-2xl">your queue is empty</p>
          <div className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 px-4 py-2 mt-4 mb-2">
            Add Songs
          </div>
          <p className=" font-normal text-sm mt-1">don&apos;t tell anyone 🤫</p>
        </DialogTrigger>
      )}

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
            onChange={handleSearch}
            placeholder="Search Song"
            className="border-none focus-visible:ring-0"
          />
          <DialogClose>
            {loading ? (
              <Loader2Icon className="text-zinc-500 animate-spin" />
            ) : (
              <X className="text-zinc-500 cursor-pointer" />
            )}
          </DialogClose>
        </div>
        {songs && (
          <div className="flex border-zinc-500 border-t flex-col overflow-hidden bg-[#49454F]/70 max-h-[50dvh] px-2.5 overflow-y-scroll">
            {songs?.data.results.map((song, i) => (
              <label
                htmlFor={song?.id}
                key={i}
                title={`${parse(song.name)} (${
                  formatArtistName(song?.artists?.primary) || "Unknown"
                })`}
                className={`flex gap-2 text-start cursor-pointer hover:bg-zinc-800/20 ${
                  i != songs.data.results.length - 1 && "border-b"
                }  border-[#1D192B] p-2.5 items-center`}
              >
                <Avatar className=" h-14 w-14 rounded-none">
                  <AvatarImage
                    alt={song?.name}
                    height={500}
                    width={500}
                    className=" h-full w-full"
                    src={
                      song?.image[song?.image?.length - 1]?.url || "/cache.jpg"
                    }
                  />
                  <AvatarFallback>SX</AvatarFallback>
                </Avatar>
                <div className="text-sm font-medium w-full">
                  <p className="font-semibold truncate w-10/12">{song.name}</p>
                  <p className="font-medium truncate w-10/12 text-zinc-400 text-xs">
                    {formatArtistName(song.artists.primary)}
                  </p>
                  {song?.source == "youtube" && (
                    <p className=" text-xs text-[#a176eb]">Premium ☆</p>
                  )}
                </div>
                <div className=" relative mr-0.5">
                  <input
                    onChange={() => handleSelect(song)}
                    checked={selectedSongs.includes(song)}
                    name={song?.id}
                    id={song?.id}
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border border-gray-400 rounded-sm checked:bg-purple-700 checked:border-purple checked:bg-purple"
                  />
                  <MdDone className="hidden w-4 h-4 text-white absolute left-0.5 top-0.5 peer-checked:block" />
                </div>
              </label>
            ))}

            {/* Infinite Scroll Trigger */}
            <div ref={ref} className="h-1"></div>
            {loading && (
              <p className="text-center text-zinc-500 py-4">Loading..</p>
            )}
            {songs?.data.results.length === 0 && !loading && (
              <p className="text-center text-zinc-500 py-4">No songs found.</p>
            )}
          </div>
        )}
        {selectedSongs.length > 0 && (
          <>
            <div className=" p-2 bg-[#49454F]/70 border-t pb-2  py-4 px-4 overflow-x-scroll">
              <div className="flex overflow-x-scroll items-center gap-2.5">
                {selectedSongs.map((song) => (
                  <div
                    key={song?.id}
                    className=" gap-1 bg-[#8D50F9]/20 p-1 rounded-lg border-zinc-600 border text-xs px-2 flex items-center"
                  >
                    <Avatar className="  size-8  rounded-sm">
                      <AvatarImage
                        alt={song?.name}
                        height={500}
                        width={500}
                        className=" h-full w-full rounded-md border"
                        src={
                          song?.image[song?.image?.length - 1]?.url ||
                          "/cache.jpg"
                        }
                      />
                      <AvatarFallback>SX</AvatarFallback>
                    </Avatar>
                    <div
                      title={`${parse(song.name)} (${
                        formatArtistName(song?.artists?.primary) || "Unknown"
                      })`}
                      className=" flex flex-col cursor-pointer leading-tight"
                    >
                      <p className=" w-24 font-semibold truncate">
                        {parse(song.name)}
                      </p>
                      <p className=" w-20 text-[#D0BCFF] truncate text-[9px] font-medium">
                        {formatArtistName(song?.artists?.primary) || "Unknown"}
                      </p>
                    </div>
                    <X
                      onClick={() =>
                        setSelectedSongs((prev) =>
                          prev.filter((r) => r.id !== song.id)
                        )
                      }
                      className=" cursor-pointer hover:text-zinc-400 transition-all duration-300 size-5"
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className=" p-2.5 px-4 pb-3.5 bg-[#49454F]/70 ">
              <DialogClose
                onClick={handlePlay}
                className=" py-3 w-full  rounded-xl bg-purple/80 font-semibold text-sm"
              >
                <p className="w-full text-center">Add song</p>
              </DialogClose>
            </DialogFooter>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default SearchSongPopup;
