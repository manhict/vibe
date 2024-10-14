import Image from "next/image";
import React from "react";

function Footer() {
  return (
    <footer className="border max-xl:w-9/12 max-lg:w-11/12 max-md:hidden backdrop-blur-lg  select-none w-7/12 p-3 rounded-xl px-5 z-40 border-[#49454F] flex items-center justify-between ">
      <div className=" flex -ml-1 text-2xl font-semibold gap-2">
        <p className=" mt-2">Just</p>{" "}
        <span>
          {" "}
          <Image src={"/logo.svg"} alt="logo" height={45} width={45} />
        </span>
        <p className=" mt-2">together.</p>
      </div>
      <div className=" flex text-right text-sm font-medium text-zinc-200 flex-col">
        <p>
          Developed by{" "}
          <a
            href="https://tanmayo7.vercel.app/"
            target="_blank"
            className="underline-offset-2 hover:underline"
          >
            babyo7_
          </a>
        </p>
        <p>
          Designed by{" "}
          <a
            href="https://www.instagram.com/justcrazzyxd/"
            target="_blank"
            className="underline-offset-2 hover:underline"
          >
            Ajay Sharma
          </a>
        </p>
      </div>
    </footer>
  );
}

export default Footer;
