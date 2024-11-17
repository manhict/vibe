"use client";
import { useSocket } from "@/Hooks/useSocket";
import { BACKGROUND_APP_TIMEOUT, getRandom } from "@/utils/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
const message = [
  {
    msg: "Welcome back",
    gif: "https://media.tenor.com/1Us4pAnPJhMAAAPo/cat-fail.mp4",
  },
  {
    msg: "Missed you",
    gif: "https://media.tenor.com/IIP-XG_-GjUAAAPo/kitty-cat.mp4",
  },
  {
    msg: "oops, i was just hiding",
    gif: "https://media.tenor.com/mAXtaG12njEAAAPo/cats-kissing.mp4",
  },
];

function Reconnect() {
  const { hiddenTimeRef } = useSocket();
  const [emotion] = useState(getRandom(message));
  if (!hiddenTimeRef.current) return;
  if (hiddenTimeRef.current < BACKGROUND_APP_TIMEOUT) return;
  return (
    <div className=" w-full inset-0 max-md:px-5 max-md:text-xl text-zinc-200 h-screen bg-black/70 backdrop-blur-sm z-50 absolute flex items-center flex-col justify-center font-semibold text-3xl">
      <p>{emotion.msg}</p>
      {/* <p>Restoring activity...</p> */}
      <div className=" my-4 rounded-xl overflow-hidden">
        <video muted autoPlay loop src={emotion.gif} height={400} width={400} />
      </div>
      <LoaderCircleIcon className=" my-2 size-7 animate-spin" />
    </div>
  );
}

export default Reconnect;
