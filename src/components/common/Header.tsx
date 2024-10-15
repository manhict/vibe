import Image from "next/image";
import SearchSongPopup from "../SearchSongPopup";
import Userprofile from "../Userprofile";
import Link from "next/link";

function Header() {
  return (
    <header className="border max-xl:w-9/12 max-lg:w-11/12 max-md:border-none max-md:rounded-none backdrop-blur-lg max-md:w-full w-7/12 p-3 rounded-xl px-5 z-40 border-[#49454F] flex items-center justify-between ">
      <Link target="_blank" href={"/"} className=" cursor-pointer">
        <Image
          src={"/logo.svg"}
          className=" size-12"
          alt="logo"
          height={500}
          width={500}
        />
      </Link>

      <SearchSongPopup />
      <Userprofile />
    </header>
  );
}

export default Header;
