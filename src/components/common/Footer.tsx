"use client";
import { InstagramLogo } from "@phosphor-icons/react/dist/icons/InstagramLogo";
import { XLogo } from "@phosphor-icons/react/dist/icons/XLogo";
import Image from "next/image";
import Link from "next/link";

function Footer() {
  return (
    <footer className="border max-md:border-none max-xl:w-11/12 max-lg:w-11/12 border-white/15 max-sm:w-full backdrop-blur-lg  max-md:w-full select-none w-7/12 p-3 rounded-xl px-5 z-40 flex items-center justify-between ">
      <div className=" flex -ml-1 max-md:text-base text-xl items-center font-medium gap-2">
        <p className=" ">Built by </p>{" "}
        <span>
          <Link href="https://twitter.com/tanmay11117" target="_blank">
            <Image
              title="tanmay"
              src={
                "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/TanmayIMG_4211.jpeg"
              }
              alt="logo"
              height={45}
              className=" size-8 max-md:size-7 object-cover rounded-full"
              width={45}
            />
          </Link>
        </span>
        <p className=" ">&</p>
        <span>
          <Link href="https://www.instagram.com/fixing_x/" target="_blank">
            <Image
              title="ajay"
              src={
                "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/traversity.png"
              }
              alt="logo"
              height={45}
              className=" size-8 max-md:size-7 object-cover rounded-full"
              width={45}
            />
          </Link>
        </span>
      </div>

      <div className="flex text-xl md:text-2xl  items-center gap-2">
        <Link href="https://www.instagram.com/fixing_x/" target="_blank">
          <InstagramLogo
            // size={24}
            className=" hover:text-white text-zinc-300 transition-all duration-150"
          />
        </Link>

        <Link href="https://twitter.com/tanmay11117" target="_blank">
          <XLogo
            // size={24}
            className=" hover:text-white text-zinc-300 transition-all duration-150"
          />
        </Link>
      </div>
    </footer>
  );
}

export default Footer;
