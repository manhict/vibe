/* eslint-disable @next/next/no-img-element */
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUserContext } from "@/app/store/userStore";
import { Pause, Play, SkipBack, SkipForward, X } from "lucide-react";
import { socket } from "@/app/socket";
import React, { SetStateAction, useCallback, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "../ui/tooltip";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAudio } from "@/app/store/AudioContext";
import { formatArtistName, isImageUrl } from "@/utils/utils";
import Linkify from "linkify-react";
import Link from "next/link";
function Chat({
  messagesEndRef,
  setIsChatOpen,
}: {
  setIsChatOpen: React.Dispatch<SetStateAction<boolean>>;
  messagesEndRef: React.RefObject<HTMLDListElement>;
}) {
  const { currentSong, playPrev, playNext, togglePlayPause, isPlaying } =
    useAudio();
  const [message, setMessage] = useState<string>("");
  const { user, listener, messages } = useUserContext();
  const sendMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (String(message).trim().length == 0) return;
      socket.emit("message", message);
      setMessage("");
    },
    [message]
  );

  return (
    <>
      <div className=" flex  p-5 justify-between items-center">
        <div className=" flex w-9/12 truncate items-center gap-1.5">
          <Avatar className=" rounded-md size-14">
            <AvatarImage
              alt={currentSong?.name || ""}
              height={300}
              width={300}
              className=" h-full object-cover  w-full"
              src={
                currentSong?.image[currentSong.image.length - 1].url ||
                "/cache.jpg"
              }
            />
          </Avatar>
          <div className=" truncate">
            <p className=" truncate text-base">{currentSong?.name}</p>
            <p className="truncate text-xs">
              {(currentSong &&
                formatArtistName(currentSong?.artists.primary)) ||
                "Unknown"}
            </p>
          </div>
        </div>
        <div>
          <div className=" flex items-center w-fit gap-2">
            <SkipBack
              onClick={playPrev}
              aria-label="play prev"
              className={`${
                user?.role !== "admin" ? "text-zinc-700" : ""
              } cursor-pointer size-4`}
            />
            <div
              onClick={togglePlayPause}
              className=" bg-[#8D50F9] cursor-pointer p-4 rounded-full"
            >
              {isPlaying ? (
                <Pause className=" size-4" />
              ) : (
                <Play className=" size-4" />
              )}
            </div>
            <SkipForward
              onClick={playNext}
              aria-label="play next"
              className={`${
                user?.role !== "admin" ? "text-zinc-700" : ""
              } cursor-pointer size-4`}
            />
          </div>
        </div>
      </div>

      <div className=" flex py-2 px-5 text-2xl font-semibold bg-white/10 w-full justify-between items-center">
        <p>Chat</p>
        <div className=" flex items-center">
          {user &&
            listener?.roomUsers
              ?.filter((r) => r.userId?._id !== user?._id)
              ?.map((roomUser, i) => (
                <TooltipProvider key={roomUser?._id}>
                  <Tooltip>
                    <TooltipTrigger>
                      <div className={` ${i !== 0 && "-ml-2"} size-7`}>
                        <Avatar className=" size-7 border border-white">
                          <AvatarImage
                            alt={roomUser?.userId?.name}
                            height={200}
                            width={200}
                            className=" rounded-full"
                            src={roomUser?.userId?.imageUrl}
                          />
                        </Avatar>
                      </div>
                    </TooltipTrigger>
                    <TooltipContent className=" bg-[#9870d3] mb-1 text-white">
                      <p>
                        {roomUser?.userId?.username} ({roomUser?.userId?.name})
                      </p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              ))}
          {listener && listener?.totalUsers > 4 && (
            <div className={` -ml-4 px-2 py-1 text-[9px]  rounded-full`}>
              <Avatar className=" size-7 border-white border">
                <AvatarFallback>
                  {" "}
                  +{listener?.totalUsers > 100 ? 99 : listener?.totalUsers - 4}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <X onClick={() => setIsChatOpen(false)} className=" cursor-pointer" />
      </div>
      <div className="  h-full overflow-y-scroll px-5 pb-4 flex flex-col justify-between ">
        <div className=" flex-grow gap-4 flex flex-col py-6 overflow-y-scroll">
          {user &&
            messages.map((message) => (
              //@ts-expect-error:ex
              <div ref={messagesEndRef} key={message.message}>
                {message.user._id !== user?._id ? (
                  <div className=" flex gap-2">
                    <Avatar className="size-9">
                      <AvatarImage
                        alt={message?.user?.name || ""}
                        height={50}
                        width={50}
                        className=" h-full object-cover  w-full"
                        src={message?.user.imageUrl || "/bg.webp"}
                      />
                      <AvatarFallback>SX</AvatarFallback>
                    </Avatar>
                    <div className="w-full">
                      <p className="truncate -mt-0.5 border-white w-5/12 font-semibold mb-1.5">
                        {message?.user?.name}
                      </p>

                      {isImageUrl(message?.message) ? (
                        <Link href={message?.message} target="_blank">
                          <img
                            src={message?.message}
                            alt="User sent image"
                            className="w-fit max-h-72 max-w-5/12 rounded-lg rounded-tl-none"
                          />
                        </Link>
                      ) : (
                        <Linkify
                          as="p"
                          options={{
                            target: "_blank",

                            render: {
                              hashtag: renderLink,
                              mention: renderLink,
                            },
                          }}
                        >
                          <p className="w-fit max-w-7/12 bg-white/20 text-sm px-4 py-1 rounded-md rounded-tl-none">
                            {message?.message}
                          </p>
                        </Linkify>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className=" flex w-full self-end gap-2">
                    <div className=" w-full flex flex-col justify-end items-end">
                      <p className=" truncate -mt-0.5 text-end font-semibold mb-1.5 w-5/12">
                        {message.user?.name}
                      </p>
                      {isImageUrl(message?.message) ? (
                        <Link href={message?.message} target="_blank">
                          <img
                            src={message?.message}
                            alt="User sent image"
                            className="w-fit max-h-72 max-w-7/12 self-end rounded-lg rounded-tr-none"
                          />
                        </Link>
                      ) : (
                        <Linkify
                          as="p"
                          options={{
                            target: "_blank",

                            render: {
                              hashtag: renderLink,
                              mention: renderLink,
                            },
                          }}
                        >
                          <p className=" w-fit  text-end max-w-7/12 bg-white/20 text-sm px-4 py-1 rounded-md rounded-tr-none">
                            {message?.message}
                          </p>
                        </Linkify>
                      )}
                    </div>
                    <Avatar className="size-9">
                      <AvatarImage
                        alt={message?.user?.name || ""}
                        height={50}
                        width={50}
                        className=" h-full object-cover  w-full"
                        src={message?.user?.imageUrl || "/bg.webp"}
                      />
                      <AvatarFallback>SX</AvatarFallback>
                    </Avatar>
                  </div>
                )}
              </div>
            ))}
        </div>
        <form onSubmit={sendMessage} className=" relative">
          <Input
            onChange={(e) => setMessage(e.target.value)}
            value={message}
            name="message"
            id="message"
            type="text"
            className=" bg-white/5 rounded-xl py-5 border border-white/20"
            placeholder="Send Message"
          />
          <Button
            size={"sm"}
            className=" absolute right-1.5 top-1 bg-[#8D50F9]  hover:bg-[#8D50F9] text-white rounded-lg px-4"
          >
            Send
          </Button>
        </form>
      </div>
    </>
  );
}

//@ts-expect-error:ex
const renderLink = ({ attributes, content }) => {
  const { href, ...props } = attributes;
  return (
    <Link to={href} {...props}>
      {content}
    </Link>
  );
};

export default Chat;
