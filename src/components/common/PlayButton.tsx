import { useAudio } from "@/app/store/AudioContext";
import { cn } from "@/lib/utils";
import { pauseVariants, playVariants } from "@/utils/utils";
import { AnimatePresence, motion } from "framer-motion";
import { Pause, Play } from "lucide-react";

function PlayButton({ className }: { className?: string }) {
  const { isPlaying, togglePlayPause } = useAudio();
  return (
    <div
      onClick={togglePlayPause}
      className="bg-purple cursor-pointer p-4 rounded-full"
    >
      <div className=" w-fit overflow-hidden">
        <AnimatePresence mode="wait" key={"play pause"}>
          {isPlaying ? (
            <motion.div
              key="pause" // Unique key for Pause icon
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={pauseVariants} // Pause icon animation
            >
              <Pause className={cn("size-5", className)} />
            </motion.div>
          ) : (
            <motion.div
              key="play" // Unique key for Play icon
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={playVariants} // Play icon animation
            >
              <Play className={cn("size-5", className)} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default PlayButton;
