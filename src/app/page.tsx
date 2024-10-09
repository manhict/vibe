"use client";
import { Button } from "@/components/ui/button";
import { InstagramLogo } from "@phosphor-icons/react/InstagramLogo";
import { XLogo } from "@phosphor-icons/react/XLogo";
import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { socket } from "./socket";
import { useAudio } from "./store/AudioContext";
function Page() {
  const { pause } = useAudio();
  useEffect(() => {
    if (socket.connected) {
      socket.disconnect();
      pause();
    }
  }, [pause]);

  return (
    <div className=" h-dvh w-dvw bg-[url('/background.png')] bg-cover">
      <div className="  w-full h-[87dvh] flex justify-center items-center">
        <div className=" w-8/12">
          <div className=" w-1/2 flex font-semibold gap-4 flex-col">
            <Image
              src={"/logo.svg"}
              className=" ml-1 size-20"
              alt="logo"
              height={80}
              width={80}
            />
            <p className=" text-7xl -mt-2">
              Delightful <br />
              Music Parties
            </p>
            <p className=" -mt-4 text-7xl text-with-image">Start Here.</p>
            <span className="ml-1 font-normal text-lg leading-tight my-2.5 mb-1">
              High quality music, invite friends
              <br />& host a memorable event today.
            </span>
            <Link href={"/v"}>
              <Button className=" w-fit ml-1 ">Start Vibing</Button>
            </Link>
          </div>
        </div>
      </div>
      <footer className="  absolute bottom-7 w-full flex justify-center items-center">
        <div className=" w-9/12 border-t py-4 px-7 text-sm flex justify-between items-center border-white/20">
          <p className=" text-white/70">
            Built by{" "}
            <span className=" hover:text-white hover:underline hover:underline-offset-4 transition-all duration-500">
              <Link href="https://tanmayo7.vercel.app/" target="_blank">
                Tanmay Singh
              </Link>
            </span>{" "}
            &{" "}
            <span className=" hover:text-white hover:underline hover:underline-offset-4 transition-all duration-500">
              <Link
                href="https://www.instagram.com/justcrazzyxd/"
                target="_blank"
              >
                Ajay Sharma
              </Link>
            </span>
          </p>
          <div className=" flex items-center text-white/70 gap-2">
            <Link
              href="https://www.instagram.com/justcrazzyxd/"
              target="_blank"
            >
              <InstagramLogo
                size={24}
                className=" hover:text-white transition-all duration-500"
              />
            </Link>

            <Link href="https://twitter.com/tanmay11117" target="_blank">
              <XLogo
                size={24}
                className=" hover:text-white transition-all duration-500"
              />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Page;
