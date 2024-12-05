/* eslint-disable @next/next/no-img-element */
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useUserContext } from "@/store/userStore";
import { X } from "lucide-react";
import React, {
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useAudio } from "@/store/AudioContext";
import {
  containsOnlyEmojis,
  formatArtistName,
  isImageUrl,
  linkifyOptions,
} from "@/utils/utils";
import Linkify from "linkify-react";
import Link from "next/link";
import PlayButton from "./PlayButton";
import { toast } from "sonner";
import { messages } from "@/lib/types";
import { decrypt } from "tanmayo7lock";

function Chat({
  setIsChatOpen,
  isChatOpen,
}: {
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<SetStateAction<boolean>>;
}) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { currentSong, playPrev, playNext } = useAudio();
  const [message, setMessage] = useState<string>("");
  const { user, listener, emitMessage, setSeen, socketRef } = useUserContext();
  const [messages, setMessages] = useState<messages[]>([]);

  const sendMessage = useCallback(
    (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      if (message.length > 500) return toast.error("Message size exceeded");
      if (String(message).trim().length == 0) return;
      emitMessage("message", message);
      setMessage("");
    },
    [message, emitMessage]
  );

  const handleMessage = useCallback(
    (data: any): void => {
      const message = decrypt(data) as messages;
      setMessages((prev) => [...prev, message]);
      const audio = new Audio(
        "https://assets.mixkit.co/active_storage/sfx/2354/2354-preview.mp3"
      );
      if (!isChatOpen) {
        setSeen(false);
      }
      if (document.hidden) {
        audio.play();
      } else {
        audio.pause();
        audio.currentTime = 0; // Reset the audio if needed
      }
    },
    [setSeen, isChatOpen]
  );

  useEffect(() => {
    const currentSocket = socketRef.current;
    currentSocket.on("message", handleMessage);
    return () => {
      currentSocket.off("message", handleMessage);
    };
  }, [socketRef, handleMessage]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <>
      <div className=" flex hide-scrollbar p-5 justify-between items-center">
        <div className=" flex w-9/12 truncate items-center gap-1.5">
          <Avatar className=" rounded-md size-14">
            <AvatarImage
              loading="lazy"
              alt={currentSong?.name || ""}
              height={300}
              width={300}
              className=" h-full object-cover  w-full"
              src={
                currentSong?.image[currentSong.image.length - 1].url ||
                "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/d61488c1ddafe4606fe57013728a7e84.jpg"
              }
            />
          </Avatar>
          <div className=" truncate w-9/12">
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
            <svg
              onClick={playPrev}
              aria-label="play prev"
              className=" size-5 rotate-180"
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
              />
              <path
                d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                fillOpacity="0.5"
              />
            </svg>
            <PlayButton className=" size-4" />
            <svg
              onClick={playNext}
              aria-label="play next"
              className="  size-5"
              width="21"
              height="16"
              viewBox="0 0 21 16"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M14.5392 10.1308C14.7748 9.95045 14.9656 9.71919 15.0968 9.4547C15.228 9.19022 15.2962 8.89953 15.2962 8.60494C15.2962 8.31034 15.228 8.01966 15.0968 7.75517C14.9656 7.49068 14.7748 7.25942 14.5392 7.07912C11.4881 4.74472 8.08115 2.90473 4.4458 1.62803L3.78112 1.39453C2.51079 0.948656 1.16819 1.79812 0.996162 3.09547C0.515602 6.75308 0.515602 10.4568 0.996162 14.1144C1.1692 15.4117 2.51079 16.2612 3.78112 15.8153L4.4458 15.5818C8.08115 14.3051 11.4881 12.4652 14.5392 10.1308Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
              />
              <path
                d="M18.6625 1.26718C18.7124 0.821304 19.0911 0.503082 19.5397 0.503082C19.9884 0.503082 20.3676 0.820549 20.4187 1.26629C20.5328 2.26253 20.6971 4.30858 20.6971 7.83333C20.6971 11.5742 20.5121 14.0197 20.3983 15.1696C20.3547 15.6102 19.9825 15.9352 19.5397 15.9352C19.0911 15.9352 18.7124 15.617 18.6625 15.1711C18.5483 14.1504 18.3823 12.0145 18.3823 8.21913C18.3823 4.42377 18.5483 2.28784 18.6625 1.26718Z"
                fill={user?.role !== "admin" ? "#434343" : "#EADDFF"}
                fillOpacity="0.5"
              />
            </svg>
          </div>
        </div>
      </div>

      <div className=" flex py-2 px-5 text-2xl font-semibold bg-white/10 w-full justify-between items-center">
        <p>Chat</p>
        <div className=" flex items-center">
          {listener?.roomUsers
            ?.filter((r) => r.userId.username !== user?.username)
            ?.slice(0, 5)
            ?.map((roomUser, i) => (
              <div
                title={`${roomUser?.userId?.username} (${roomUser?.userId?.name})`}
                key={roomUser?._id}
              >
                <div className={` ${i !== 0 && "-ml-2"} size-7`}>
                  <Avatar className=" size-7 border border-white">
                    <AvatarImage
                      loading="lazy"
                      alt={roomUser?.userId?.name}
                      height={200}
                      width={200}
                      className=" rounded-full object-cover"
                      src={roomUser?.userId?.imageUrl}
                    />
                  </Avatar>
                </div>
              </div>
            ))}
          {listener && listener?.totalUsers >= 5 && (
            <div className={` -ml-4 px-2 py-1 text-[9px]  rounded-full`}>
              <Avatar className=" size-7 border-white border">
                <AvatarFallback>
                  {" "}
                  +{listener?.totalUsers > 100 ? 99 : listener?.totalUsers - 5}
                </AvatarFallback>
              </Avatar>
            </div>
          )}
        </div>
        <X onClick={() => setIsChatOpen(false)} />
      </div>
      <div className="  h-full hide-scrollbar overflow-y-scroll px-5 pb-4 flex flex-col justify-between  break-words overflow-x-hidden">
        <div className=" flex-grow gap-4 flex hide-scrollbar flex-col py-6 overflow-y-scroll">
          {messages.map((message) => (
            <div title={message?.time} key={message?.message}>
              {message.user._id !== user?._id ? (
                <div className=" flex gap-2">
                  <Avatar className="size-9">
                    <AvatarImage
                      loading="lazy"
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
                      <Linkify as="p" options={linkifyOptions}>
                        <p
                          className={`w-fit  break-words bg-white/20 ${
                            containsOnlyEmojis(message?.message)
                              ? "text-5xl"
                              : "text-sm"
                          } px-4 py-1 rounded-md rounded-tl-none`}
                        >
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
                          className="w-fit max-h-72  self-end rounded-lg rounded-tr-none"
                        />
                      </Link>
                    ) : (
                      <Linkify as="p" options={linkifyOptions}>
                        <p
                          className={` w-fit  text-end  break-words bg-white/20  ${
                            containsOnlyEmojis(message?.message)
                              ? "text-5xl"
                              : "text-sm"
                          } px-4 py-1 rounded-md rounded-tr-none`}
                        >
                          {message?.message}
                        </p>
                      </Linkify>
                    )}
                  </div>
                  <Avatar className="size-9">
                    <AvatarImage
                      loading="lazy"
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
              <div ref={messagesEndRef}></div>
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
            className=" bg-white/5 pr-20 rounded-xl py-5 border border-white/20"
            placeholder="Send Message"
          />
          <Button
            size={"sm"}
            className=" absolute right-1.5 top-[0.349rem] bg-purple  hover:bg-purple text-white rounded-lg px-4"
          >
            Send
          </Button>
        </form>
      </div>
    </>
  );
}

export default Chat;
