import { searchResults } from "@/lib/types";
import React, { useState, useEffect, useRef } from "react";
import TopVotes from "./TopVotes";
import gsap from "gsap";

const VoteIcon = ({
  song,
  triggerUpVote,
}: {
  song: searchResults;
  triggerUpVote: (e: React.MouseEvent, song: searchResults) => void;
}) => {
  const [isVoted, setIsVoted] = useState(false);
  const heartRef = useRef<SVGPathElement>(null);
  const arrowRef = useRef<SVGPathElement>(null);
  const [showVotes, setShowVotes] = useState(false);
  const handleClick = (e: React.MouseEvent, song: searchResults) => {
    triggerUpVote(e, song);

    // Toggle the vote state
    setIsVoted(!isVoted);

    setShowVotes(!isVoted);
  };

  useEffect(() => {
    const heart = heartRef.current;
    const arrow = arrowRef.current;

    if (heart && arrow) {
      if (isVoted) {
        // GSAP upvote animation
        gsap
          .timeline()
          .to(heart, {
            scale: 1.2,
            x: 5,
            y: -9,
            rotate: 12.3,
            fill: "#FAC800",
            duration: 0.3,
            strokeWidth: 1,
            ease: "power1.inOut",
          })
          .to(
            arrow,
            {
              x: 0,
              y: -5,
              opacity: 0,
              transformOrigin: "center center",
              duration: 0.3,
            },
            "<"
          )
          .to(heart, {
            scale: 1,
            x: 0,
            y: 0,
            strokeWidth: 0.5,
            rotate: 0,
            duration: 0.3,
            ease: "power1.inOut",
          });
      } else {
        // GSAP remove upvote animation
        gsap
          .timeline()
          .to(
            heart,
            {
              scale: 0.9,
              x: 3,
              y: 11,
              strokeWidth: 0.5,
              rotate: -20,
              fill: "#434343",
              duration: 0.3,
              ease: "power1.inOut",
            },
            "<"
          )
          .to(heart, {
            scale: 1,
            rotate: 0,
            fill: "transparent",
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power1.inOut",
          })
          .fromTo(
            arrow,
            { y: -3, rotate: 180, opacity: 0 },
            {
              scale: 1,
              y: 0,
              rotate: 0,
              opacity: 1,
              duration: 0.3,
              ease: "power1.out",
            },
            "<"
          );
      }
    }
  }, [isVoted]);

  return (
    <div className=" relative">
      {/* Main Vote SVG */}
      <svg
        onClick={(e) => handleClick(e, song)}
        width="40"
        height="40"
        viewBox="0 0 40 40"
        fill="none"
        className=" -mr-1"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          ref={heartRef}
          className="heart"
          d="M21.0475 30.3081L21.189 30.4015L21.3306 30.3081C26.2978 27.0276 29.1634 23.9123 30.5598 21.1589C31.9595 18.399 31.8836 15.9976 30.9567 14.1885C29.1574 10.6768 24.1773 9.49705 21.189 12.3124C18.2007 9.49704 13.2206 10.6771 11.4213 14.189C10.4944 15.9981 10.4185 18.3996 11.8182 21.1594C13.2147 23.9128 16.0802 27.0279 21.0475 30.3081Z"
          stroke="white"
          stroke-width="0.513732"
        />
        <path
          ref={arrowRef}
          className="arrow"
          d="M23.9314 27C23.3256 27 23.0226 27 22.8824 26.8802C22.7607 26.7763 22.6961 26.6203 22.7086 26.4608C22.7231 26.2769 22.9373 26.0627 23.3657 25.6343L26.4343 22.5657C26.6323 22.3677 26.7313 22.2687 26.8455 22.2316C26.9459 22.1989 27.0541 22.1989 27.1545 22.2316C27.2687 22.2687 27.3677 22.3677 27.5657 22.5657L30.6343 25.6343C31.0627 26.0627 31.2769 26.2769 31.2914 26.4608C31.3039 26.6203 31.2393 26.7763 31.1176 26.8802C30.9774 27 30.6744 27 30.0686 27H23.9314Z"
          fill="#FAC800"
        />
      </svg>
      {showVotes && (
        <div className="-mt-[0.365rem] -mr-1 absolute flex items-center justify-center right-0 w-full">
          <TopVotes song={song} />
        </div>
      )}
    </div>
  );
};

export default VoteIcon;
