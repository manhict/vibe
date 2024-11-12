"use client";

import { useUserContext } from "@/store/userStore";
import Image from "next/image";

function Logo() {
  const { user } = useUserContext();
  return (
    <Image
      onClick={() => {
        if (!user) {
          window.location.href = "/";
        }
      }}
      src={"/logo.svg"}
      className={`size-12 max-md:size-10 ${!user && "cursor-pointer"}`}
      alt="logo"
      height={500}
      width={500}
    />
  );
}

export default Logo;
