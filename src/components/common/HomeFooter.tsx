"use client";
import { cn } from "@/lib/utils";
import { InstagramLogo } from "@phosphor-icons/react/dist/icons/InstagramLogo";
import { XLogo } from "@phosphor-icons/react/dist/icons/XLogo";
import Link from "next/link";
import React from "react";

function HomeFooter({ className }: { className?: string }) {
  return (
    <footer
      className={cn(
        `absolute bottom-7 max-md:bottom-2 w-full flex justify-center items-center`,
        className
      )}
    >
      <div className=" w-9/12  max-md:w-full max-md:px-5 border-t py-4 px-7 text-sm flex justify-between items-center border-white/20">
        <p className=" text-white/70">
          Built by{" "}
          <span className=" hover:text-white hover:underline hover:underline-offset-4 transition-all duration-500">
            <Link href="https://tanmayo7.vercel.app/" target="_blank">
              Tanmay singh
            </Link>
          </span>{" "}
          &{" "}
          <span className=" hover:text-white hover:underline hover:underline-offset-4 transition-all duration-500">
            <Link href="https://www.instagram.com/fixing_x/" target="_blank">
              Ajay Sharma
            </Link>
          </span>
        </p>
        <div className="flex text-xl items-center text-white/70 gap-2">
          <Link href="https://www.instagram.com/fixing_x/" target="_blank">
            <InstagramLogo
              // size={24}
              className=" hover:text-white transition-all duration-500"
            />
          </Link>

          <Link href="https://twitter.com/tanmay11117" target="_blank">
            <XLogo
              // size={24}
              className=" hover:text-white transition-all duration-500"
            />
          </Link>
        </div>
      </div>
    </footer>
  );
}

export default HomeFooter;
