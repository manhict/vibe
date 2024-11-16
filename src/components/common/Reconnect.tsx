"use client";

import { useUserContext } from "@/store/userStore";
import { LoaderCircleIcon } from "lucide-react";
function Reconnect() {
  const { reconnectLoader } = useUserContext();
  if (!reconnectLoader) return;
  return (
    <div className=" w-full inset-0 text-zinc-200 h-screen bg-black/70 backdrop-blur-sm z-50 absolute flex items-center flex-col justify-center font-semibold text-xl">
      <p>(Show when app is in background for more than 5 min)</p>
      <p>Restoring activity...</p>
      <LoaderCircleIcon className=" my-2 size-7 animate-spin" />
    </div>
  );
}

export default Reconnect;
