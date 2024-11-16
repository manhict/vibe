"use client";
import { useSocket } from "@/Hooks/useSocket";
import { BACKGROUND_APP_TIMEOUT } from "@/utils/utils";
import { LoaderCircleIcon } from "lucide-react";
function Reconnect() {
  const { hiddenTimeRef } = useSocket();
  if (!hiddenTimeRef.current) return;
  if (hiddenTimeRef.current < BACKGROUND_APP_TIMEOUT) return;
  return (
    <div className=" w-full inset-0 text-zinc-200 h-screen bg-black/70 backdrop-blur-sm z-50 absolute flex items-center flex-col justify-center font-semibold text-xl">
      <p>
        (
        {`App was in background for more ${Math.floor(
          hiddenTimeRef.current / 60000
        )} minutes`}
        )
      </p>
      <p>Restoring activity...</p>
      <LoaderCircleIcon className=" my-2 size-7 animate-spin" />
    </div>
  );
}

export default Reconnect;
