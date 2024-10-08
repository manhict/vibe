import Image from "next/image";
import SearchSongPopup from "../SearchSongPopup";
import Userprofile from "../Userprofile";
import Link from "next/link";

function Header() {
  return (
    <header className="border w-7/12 p-3 rounded-xl px-5 z-40 border-[#49454F] flex items-center justify-between ">
      <Link href={"/"} className=" cursor-pointer">
        <Image src={"/logo.svg"} alt="logo" height={55} width={55} />
      </Link>

      <SearchSongPopup />
      <Userprofile />
    </header>
  );
}

export default Header;
