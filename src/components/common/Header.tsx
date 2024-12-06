"use client";
import { TUser } from "@/lib/types";
import SearchSongPopup from "../SearchSongPopup";
import Userprofile from "../Userprofile";
import Logo from "./Logo";

function Header({ user, roomId }: { user: TUser; roomId?: string }) {
  return (
    <header className="border max-sm:w-full max-xl:w-11/12 max-lg:w-11/12  max-md:border-none max-md:rounded-none backdrop-blur-lg max-md:backdrop-blur-0 max-md:bg-transparent max-md:w-full w-7/12 p-3 rounded-2xl px-5 z-40 max-md:gap-2 border-white/15 flex items-center justify-between ">
      <Logo />

      <SearchSongPopup />
      <Userprofile user={user} roomId={roomId} />
    </header>
  );
}

export default Header;
