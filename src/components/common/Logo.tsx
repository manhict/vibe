"use client";

import { cn } from "@/lib/utils";
import { useUserContext } from "@/store/userStore";
import Image from "next/image";
import React from "react";

function LogoComp({ className }: { className?: string }) {
  const { user } = useUserContext();
  return (
    <Image
      onClick={() => {
        if (!user) {
          window.location.href = "/";
        }
      }}
      src={"/logo.svg"}
      className={cn(`size-12 max-md:size-10 ${!user && ""}`, className)}
      alt="logo"
      height={500}
      width={500}
    />
  );
}
const Logo = React.memo(LogoComp);
export default Logo;
