import { searchResults } from "@/lib/types";
import React, { useState } from "react";
import TopVotes from "./TopVotes";
import { motion, AnimatePresence } from "framer-motion";

const VoteIcon = ({
  song,
  triggerUpVote,
}: {
  song: searchResults;
  triggerUpVote: (e: React.MouseEvent, song: searchResults) => void;
}) => {
  const [isClicked, setIsClicked] = useState(false);
  const [showTopVotes, setShowTopVotes] = useState(false);

  const handleClick = (e: React.MouseEvent, song: searchResults) => {
    setIsClicked(true);
    triggerUpVote(e, song);

    // Reset animation after vote
    setTimeout(() => {
      setIsClicked(false);
    }, 600);
  };

  const handleAnimationComplete = () => {
    // Trigger the appearance of TopVotes after animation ends
    const t = setTimeout(() => {
      setShowTopVotes(true);
    }, 650);
    return () => clearTimeout(t);
  };

  return (
    <>
      <div className="relative" onClick={(e) => handleClick(e, song)}>
        {/* Main Vote SVG with motion */}
        <motion.svg
          initial={{ scale: 1, rotate: 0, y: 0, fill: "transparent" }}
          animate={
            isClicked
              ? !song?.isVoted
                ? { scale: 0.9, rotate: -10, y: 5, fill: "transparent" } // Shrink and move down on unvote
                : { scale: 1.2, rotate: 10, fill: "#FAC800" } // Enlarge and tilt on upvote
              : {
                  scale: 1,
                  rotate: 0,
                  y: 0,
                  fill: !song?.isVoted ? "transparent" : "#FAC800",
                }
          }
          transition={{
            type: "spring",
            stiffness: 80,
            damping: 15,
            duration: 0.6,
            ease: "easeInOut",
          }}
          onAnimationComplete={handleAnimationComplete}
          className="cursor-pointer"
          width="23"
          height="21"
          viewBox="0 0 23 21"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.5475 20.3081L11.689 20.4015L11.8306 20.3081C16.7978 17.0276 19.6634 13.9123 21.0598 11.1589C22.4595 8.39896 22.3836 5.99759 21.4567 4.18852C19.6574 0.676764 14.6773 -0.502955 11.689 2.3124C8.70068 -0.50296 3.72063 0.677109 1.92132 4.18901C0.994411 5.99815 0.918502 8.39955 2.31822 11.1594C3.7147 13.9128 6.58024 17.0279 11.5475 20.3081Z"
            stroke="white"
            strokeWidth="0.713732"
          />
        </motion.svg>

        {/* Absolute SVG for the arrow */}

        <motion.svg
          initial={{ rotate: 0 }} // Default state for unvoted (downward arrow)
          animate={
            song?.isVoted
              ? { rotate: -180, scale: 0 } // Rotate upwards when voted
              : { scale: 1, rotate: 0 } // Rotate downwards when unvoted
          }
          transition={{ duration: 0.5, ease: "easeInOut" }}
          width="9"
          height="5"
          viewBox="0 0 9 5"
          fill="none"
          className="absolute cursor-pointer bottom-0.5 size-2.5 right-0"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.43137 5C0.825555 5 0.522647 5 0.382383 4.8802C0.260678 4.77626 0.196091 4.62033 0.208648 4.46077C0.223121 4.27688 0.437309 4.06269 0.865685 3.63431L3.93431 0.565685C4.13232 0.367677 4.23133 0.268673 4.34549 0.231579C4.44591 0.19895 4.55409 0.19895 4.65451 0.231579C4.76867 0.268673 4.86768 0.367677 5.06569 0.565685L8.13432 3.63432C8.56269 4.06269 8.77688 4.27688 8.79135 4.46077C8.80391 4.62033 8.73932 4.77626 8.61762 4.8802C8.47735 5 8.17445 5 7.56863 5H1.43137Z"
            fill="#FAC800"
          />
        </motion.svg>
      </div>

      {/* AnimatePresence for TopVotes component */}
      <AnimatePresence>
        {showTopVotes && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{
              duration: 0.5,
              ease: "easeInOut",
            }}
            className="flex -mt-1 text-xs items-center"
          >
            <TopVotes song={song} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default VoteIcon;
