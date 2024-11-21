"use client";
import AddToQueue from "@/components/common/AddToQueue";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Player from "@/components/common/Player";
import DraggableOptions from "./DraggableOptions";
import { TUser } from "@/lib/types";
import { motion, AnimatePresence } from "framer-motion";
import { useUserContext } from "@/store/userStore";
import Popups from "./Popups";
import HyperText from "../ui/hyper-text";
export default function Home({
  user,
  roomId,
}: {
  user: TUser;
  roomId?: string;
}) {
  const { socketRef } = useUserContext();
  const loaderVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.5 } },
    exit: { opacity: 0, transition: { duration: 0.5 } },
  };

  return (
    <>
      <Popups />
      <AnimatePresence>
        {!socketRef.current?.connected && (
          <motion.div
            className="w-full inset-0 max-md:px-5 max-md:text-xl text-zinc-200 h-screen bg-black backdrop-blur-sm z-[100] absolute flex items-center flex-col justify-center font-semibold text-2xl"
            initial="hidden"
            animate="visible"
            exit="exit"
            variants={loaderVariants}
          >
            <HyperText
              className="text-4xl font-bold text-black dark:text-white"
              text="vibe"
            />
          </motion.div>
        )}
      </AnimatePresence>
      <DraggableOptions />
      <div
        className={`${
          socketRef.current.connected ? "opacity-100" : "opacity-0"
        }  bg-cover absolute w-full top-0 flex flex-col items-center justify-center h-full md:py-2.5`}
      >
        <Header user={user} roomId={roomId} />

        <div className="max-md:w-full max-md:gap-0 h-full z-40 flex-wrap flex overflow-hidden max-xl:w-11/12 max-lg:w-11/12 max-sm:w-full max-md:overflow-scroll hide-scrollbar py-4 max-md:py-0 gap-4 w-7/12">
          <Player />

          <AddToQueue />
        </div>

        <Footer />
      </div>
    </>
  );
}
