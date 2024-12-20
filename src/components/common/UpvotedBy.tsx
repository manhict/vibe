import { useAudio } from "@/store/AudioContext";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

function UpvotedBy() {
  const { currentSong } = useAudio();
  return (
    <>
      <div
        title="Added by "
        className="absolute bottom-1 left-1  shadow-md p-1.5 rounded-full whitespace-nowrap  flex items-center justify-center bg-black/60 backdrop-blur-xl"
      >
        <Avatar
          key={currentSong?.addedByUser?._id}
          title={`${currentSong?.addedByUser?.username} (${currentSong?.addedByUser?.name})`}
          className=" size-6 border-[1.9px] border-white/80"
        >
          <AvatarImage
            loading="lazy"
            alt={currentSong?.addedByUser?.name}
            height={200}
            width={200}
            className=" rounded-full"
            src={currentSong?.addedByUser?.imageUrl}
          />
          <AvatarFallback>SX</AvatarFallback>
        </Avatar>
      </div>

      {currentSong?.topVoters && currentSong.topVoters.length > 0 && (
        <div
          title="Upvoted by "
          className="absolute bottom-1 right-1  p-1.5 px-2.5 rounded-full  flex items-center justify-start gap-1 bg-black/60 backdrop-blur-xl"
        >
          <div>
            <svg
              width="24"
              height="23"
              viewBox="0 0 24 23"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M11.2333 20.4538L11.5 20.622L11.7667 20.4538C16.418 17.5205 19.1323 14.7164 20.4651 12.2069C21.8059 9.68231 21.7501 7.44383 20.8346 5.73766C19.1142 2.53121 14.4311 1.41242 11.5 3.84694C8.56888 1.41241 3.88581 2.53154 2.16539 5.73809C1.24993 7.44433 1.1941 9.68284 2.5349 12.2073C3.86775 14.7168 6.58201 17.5208 11.2333 20.4538Z"
                fill="#FAC800"
                stroke="white"
              />
            </svg>
          </div>

          <div className=" flex items-center  justify-end">
            {currentSong?.topVoters?.map((voter, i) => (
              <div
                key={voter._id}
                title={`${voter?.username} (${voter?.name})`}
              >
                <div className={` ${i !== 0 && "ml-0.5"} size-3 mb-2.5`}>
                  <Avatar className=" size-6 border-[1.9px] border-white/80">
                    <AvatarImage
                      loading="lazy"
                      alt={voter?.name}
                      height={200}
                      width={200}
                      className=" rounded-full"
                      src={voter?.imageUrl}
                    />
                    <AvatarFallback>SX</AvatarFallback>
                  </Avatar>
                </div>
              </div>
            ))}

            {currentSong && currentSong.voteCount > 2 && (
              <div
                className={` -ml-1.5 pl-2  text-[9px]  font-bold rounded-full`}
              >
                <Avatar className=" size-6 border-white/80 border-[1.9px]">
                  <AvatarFallback className=" bg-purple">
                    +{currentSong?.voteCount - 2}
                  </AvatarFallback>
                </Avatar>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

export default UpvotedBy;
