/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { cn } from "@/lib/utils";
import { useUserContext } from "@/store/userStore";
import Image from "next/image";
import React from "react";

function LogoComp({ className }: { className?: string }) {
  // const { user } = useUserContext();
  return <p className=" text-2xl font-semibold">Vibe </p>;
}
const Logo = React.memo(LogoComp);
export default Logo;
