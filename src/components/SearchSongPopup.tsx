"use client";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Loader2Icon, Search, Star, X } from "lucide-react";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { MdDone } from "react-icons/md";
import { searchResults, searchSongResult } from "@/lib/types";
import api from "@/lib/api";
import useDebounce from "@/Hooks/useDebounce";
import { extractPlaylistID, formatArtistName } from "@/utils/utils";
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
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { toast } from "sonner";
import parse from "html-react-parser";
import useSelect from "@/Hooks/useSelect";
import { GrYoutube } from "react-icons/gr";
import { useUserContext } from "@/store/userStore";
import { emitMessage } from "@/lib/customEmits";
import { Skeleton } from "@/components/ui/skeleton";
import useAddSong from "@/Hooks/useAddSong";

function SearchSongPopupComp({
  isAddToQueue = false,
  youtube = false,
}: {
  isAddToQueue?: boolean;
  youtube?: boolean;
}) {
  const [songs, setSongs] = useState<searchSongResult | null>(null);
  const [page, setPage] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(false);
  const { ref, inView } = useInView();
  const { roomId, user } = useUserContext();
  const [query, setQuery] = useState<string>("");
  const abortControllerRef = useRef<AbortController | null>(null);
  const { addSong } = useAddSong();
  const search = useCallback(
    async (e: React.ChangeEvent<HTMLInputElement>) => {
      try {
        if (abortControllerRef.current) {
          abortControllerRef.current.abort();
        }
        const value = e.target.value.trim();
        setQuery(value);
        if (value.length <= 0) {
          setSongs(null);
          return;
        }

        const controller = new AbortController();
        abortControllerRef.current = controller;
        const url = youtube
          ? `${process.env.SOCKET_URI}/api/youtube?id=${extractPlaylistID(
              value
            )}`
          : `${process.env.SOCKET_URI}/api/search/?name=${value}&page=0`;

        setPage(0); // Reset page on a new search
        setLoading(true);
        const res = await api.get(url, { signal: controller.signal });
        if (res.success) {
          if (youtube) {
            const tracks = res.data as searchResults[];
            setSongs({
              success: true,
              data: {
                total: tracks.length,
                start: 0,
                results: tracks,
              },
            });
          } else {
            setSongs((res?.data as searchSongResult) || []);
          }
        }
      } catch (error) {
      } finally {
        setLoading(false);
      }
    },
    [youtube]
  );

  const handleSearch = useDebounce(search);

  const searchMoreSongs = useCallback(async () => {
    if (!query || !songs || songs.data.results.length >= songs.data.total)
      return;

    setLoading(true);
    const url = `${process.env.SOCKET_URI}/api/search/?name=${query}&page=${
      page + 1
    }`;

    const res = await api.get(url);
    if (res.success) {
      setSongs({
        ...songs,
        data: {
          ...songs?.data,
          results: [
            ...songs?.data.results,
            ...(res.data as searchSongResult).data.results,
          ],
        },
      });
      setPage((prevPage) => prevPage + 1);
    }
    setLoading(false);
  }, [query, page, songs]);

  useEffect(() => {
    if (inView && !loading) {
      searchMoreSongs();
    }
  }, [inView, loading, searchMoreSongs]);

  const { handleSelect, selectedSongs, setSelectedSongs } = useSelect();
  const handleAdd = useCallback(async () => {
    if (selectedSongs.length == 0) return;
    if (!user)
      return toast.error("Login to add song in queue", {
        style: { background: "#e94625" },
      });
    if (selectedSongs.length == 0) return toast.error("No song selected");
    await addSong(selectedSongs, roomId);
    setSelectedSongs([]);
  }, [setSelectedSongs, selectedSongs, user, roomId, addSong]);

  const handleAddAll = useCallback(async () => {
    if (songs && songs?.data.results.length > 0) {
      toast.loading("Adding songs to queue", { id: "adding" });

      const batchSize = 100;
      const results = songs?.data.results;
      const totalBatches = Math.ceil(results.length / batchSize);
      const concurrencyLimit = 5; // Adjust the concurrency limit as needed

      const addBatch = async (batch: any) => {
        return api.post(
          `${process.env.SOCKET_URI}/api/add?room=${roomId}`,
          batch
        );
      };

      const executeBatches = async () => {
        const batchPromises = [];

        for (let i = 0; i < totalBatches; i++) {
          const batch = results.slice(i * batchSize, (i + 1) * batchSize);
          batchPromises.push(addBatch(batch));

          // If we reach the concurrency limit, wait for these to resolve
          if (batchPromises.length === concurrencyLimit) {
            const responses = await Promise.all(batchPromises);
            if (responses.some((res) => !res.success)) {
              throw new Error("Failed to add some songs to the queue");
            }
            batchPromises.length = 0; // Clear the resolved batch
          }
        }

        // Final set of promises if any remain
        if (batchPromises.length > 0) {
          const responses = await Promise.all(batchPromises);
          if (responses.some((res) => !res.success)) {
            throw new Error("Failed to add some songs to the queue");
          }
        }
      };

      try {
        await executeBatches();
        emitMessage("update", "update");
        toast.success("All songs added to queue");
      } catch (error: any) {
      } finally {
        toast.dismiss("adding");
      }
    }
  }, [songs, roomId]);

  return (
    <Dialog key={"songs"}>
      {youtube ? (
        <DialogTrigger className=" items-center justify-center flex t h-8 rounded-lg px-2 text-xs bg-red-500 w-fit hover:bg-red-500 hover:opacity-80 duration-300">
          <GrYoutube className="size-4" />
        </DialogTrigger>
      ) : (
        <>
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
              <p className=" font-semibold text-3xl ">Seems like</p>
              <p className=" font-medium text-xl">your queue is empty</p>
              <div className="inline-flex items-center rounded-lg justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-8 px-4 py-2 mt-4 mb-2">
                Add Songs
              </div>
              <p className=" font-normal text-sm mt-1">
                don&apos;t tell anyone 🤫
              </p>
            </DialogTrigger>
          )}
        </>
      )}
      <DialogContent className="flex bg-transparent flex-col w-full overflow-hidden rounded-2xl gap-0 p-0 border-none max-w-2xl max-md:max-w-[95dvw]">
        <DialogHeader className=" h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className=" rounded-t-xl flex items-center justify-between p-2.5 px-5 bg-[#1D192B]">
          <DialogClose>
            <ArrowLeft className="text-zinc-500 " />
          </DialogClose>
          <Input
            autoFocus
            onChange={handleSearch}
            placeholder={
              youtube
                ? "Paste youtube playlist url to add songs"
                : "What u wanna listen?"
            }
            className="border-none focus-visible:ring-0"
          />
          <DialogClose>
            {loading ? (
              <Loader2Icon className="text-zinc-500 animate-spin" />
            ) : (
              <X className="text-zinc-500 " />
            )}
          </DialogClose>
        </div>
        {loading && !songs && (
          <div className="flex border-zinc-500 border-t flex-col overflow-hidden bg-black/80 hide-scrollbar max-h-[50dvh] overflow-y-scroll">
            {Array.from(Array(6)).map((_, i) => (
              <div
                key={i}
                className="flex gap-2  rounded-none text-start  border-b border-white/20 p-2.5 px-4 items-center "
              >
                <Skeleton className="h-14 w-14  rounded-none" />
                <div className="text-sm space-y-1 font-medium w-10/12 truncate">
                  <div className="font-semibold truncate w-11/12">
                    <Skeleton className=" w-40 h-3 rounded-none" />
                  </div>
                  <div className="font-medium truncate w-10/12 text-zinc-400 text-xs">
                    <Skeleton className=" w-32 h-3 rounded-none" />
                  </div>
                  <p className=" text-xs text-[#a176eb]">☆</p>
                </div>
              </div>
            ))}
          </div>
        )}
        {songs && (
          <div className="flex border-zinc-500 border-t flex-col overflow-hidden bg-black/80 max-h-[50dvh] pl-2.5 overflow-y-scroll">
            {songs?.data.results.map((song, i) => (
              <label
                htmlFor={song?.id}
                key={i}
                title={`${parse(song.name)} (${
                  formatArtistName(song?.artists?.primary) || "Unknown"
                })`}
                className={`flex gap-2 px-2.5 text-start  hover:bg-zinc-800/20 ${
                  i != songs.data.results.length - 1 && "border-b"
                }  border-white/20 p-2.5 items-center`}
              >
                <Avatar className=" h-14 w-14 rounded-none">
                  <AvatarImage
                    loading="lazy"
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
                <div className="text-sm font-medium w-10/12 truncate">
                  <p className="font-semibold truncate w-11/12">
                    {parse(song.name)}
                  </p>
                  <p className="font-medium truncate w-10/12 text-zinc-400 text-xs">
                    {formatArtistName(song.artists.primary)}
                  </p>
                  {song?.source !== "youtube" && (
                    <p className=" text-xs text-[#a176eb]">☆</p>
                  )}
                </div>
                <div className=" relative ">
                  <input
                    onChange={() => handleSelect(song, true)}
                    checked={selectedSongs.includes(song)}
                    name={song?.id}
                    id={song?.id}
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border border-gray-400 inset-0 rounded-[2px] checked:bg-purple-700 checked:border-purple checked:bg-purple"
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
            <div className=" p-2 bg-black/80 border-t pb-0 py-4 px-4 overflow-x-scroll">
              <div className="flex overflow-x-scroll items-center gap-2.5">
                {selectedSongs?.map((song) => (
                  <div
                    key={song?.id}
                    className=" gap-1 bg-[#8D50F9]/20 p-1 rounded-lg border-zinc-600 border text-xs px-2 py-1.5 flex items-center"
                  >
                    <Avatar className="  size-8  rounded-sm">
                      <AvatarImage
                        loading="lazy"
                        alt={song?.name}
                        height={500}
                        width={500}
                        className=" h-full w-full border"
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
                      className=" flex flex-col  leading-tight"
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
                      className="  hover:text-zinc-400 transition-all duration-300 size-5"
                    />
                  </div>
                ))}
              </div>
            </div>
            <DialogFooter className=" p-2.5 px-4 pb-4 bg-black/80 ">
              <DialogClose
                disabled={selectedSongs.length == 0}
                onClick={handleAdd}
                className=" py-3 w-full disabled:bg-purple/50 rounded-xl bg-purple/80 font-semibold text-sm"
              >
                <p className="w-full text-center">Add song</p>
              </DialogClose>
            </DialogFooter>
          </>
        )}
        {youtube &&
          songs &&
          songs?.data?.results?.length > 0 &&
          user?.role == "admin" &&
          selectedSongs?.length == 0 && (
            <DialogFooter className=" p-2.5 px-4 pb-3.5 bg-[#49454F]/70 ">
              <DialogClose
                onClick={handleAddAll}
                className=" py-3 w-full rounded-xl bg-purple/80 font-semibold text-sm"
              >
                <p className="w-full text-center">Add All</p>
              </DialogClose>
            </DialogFooter>
          )}
      </DialogContent>
    </Dialog>
  );
}
const SearchSongPopup = React.memo(SearchSongPopupComp);
export default SearchSongPopup;
