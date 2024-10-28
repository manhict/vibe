import { cn } from "@/lib/utils";
import React from "react";
import { motion } from "framer-motion";
function Blur({ className }: { className?: string }) {
  return (
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
      className={cn(
        "absolute h-dvh w-dvw bg-black/80 backdrop-blur-sm top-0",
        className
      )}
    ></motion.div>
  );
}

export default Blur;
