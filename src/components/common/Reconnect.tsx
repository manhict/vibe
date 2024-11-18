"use client";
import { useSocket } from "@/Hooks/useSocket";
import { BACKGROUND_APP_TIMEOUT, getRandom } from "@/utils/utils";
import { LoaderCircleIcon } from "lucide-react";
import { useState } from "react";
const message = [
  {
    msg: "Welcome back",
    gif: "https://media.tenor.com/s3x-q943K-MAAAPo/omori-basil.mp4",
  },
  {
    msg: "Missed you",
    gif: "https://media.tenor.com/Ag8zeVQT3fYAAAPo/wizard-cat-cat-wizard.mp4",
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
    <div className=" w-full inset-0 max-md:px-5 max-md:text-xl text-zinc-200 h-screen bg-black/40 backdrop-blur-sm z-50 absolute flex items-center flex-col justify-center font-semibold text-2xl">
      <p>{emotion.msg}</p>
      <div className=" my-4 rounded-xl overflow-hidden">
        <video muted autoPlay loop src={emotion.gif} height={280} width={280} />
      </div>
      <p className=" text-lg">Restoring activity...</p>
      <LoaderCircleIcon className=" my-2 size-7 animate-spin" />
    </div>
  );
}

export default Reconnect;
