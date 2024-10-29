"use client";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import Link from "next/link";
import Blur from "@/components/Blur";
import HomeFooter from "@/components/common/HomeFooter";
import { motion } from "framer-motion";
function Page() {
  return (
    <>
      <Blur className=" blur-2xl bg-transparent" />
      <motion.div
        initial={{
          opacity: 0,
          filter: "blur(10px)",
        }}
        animate={{ y: 0, opacity: 1, filter: "blur(0px)" }}
        transition={{
          duration: 0.5,
        }}
        exit={{ opacity: 0 }}
        className=" h-dvh w-dvw bg-[url('/background.webp')] bg-no-repeat bg-cover"
      >
        <div className=" z-50 absolute w-full h-[87dvh] flex justify-center items-center">
          <div className=" w-8/12 max-md:w-full max-md:px-5">
            <div className=" w-1/2 max-md:text-center  max-md:w-full flex font-semibold gap-4 flex-col max-md:justify-center max-md:items-center">
              <Image
                src={"/logo.svg"}
                className=" ml-1 size-20"
                alt="logo"
                height={80}
                width={80}
              />
              <p className=" text-7xl max-md:text-5xl -mt-2">
                Delightful <br />
                Music Parties
              </p>
              <p className=" -mt-4 text-7xl max-md:text-5xl   text-with-image">
                Start Here.
              </p>
              <span className="ml-1 font-normal text-lg leading-tight my-2.5 mb-1">
                High quality music, invite friends
                <br />& host a memorable event today.
              </span>
              <Link href={"/v"}>
                <Button size={"lg"} className="text-lg w-fit ml-1 ">
                  Start Vibing
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <HomeFooter />
      </motion.div>
    </>
  );
}

export default Page;
