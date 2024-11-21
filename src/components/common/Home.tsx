"use client";
import Blur from "@/components/Blur";
import AddToQueue from "@/components/common/AddToQueue";
import Footer from "@/components/common/Footer";
import Header from "@/components/common/Header";
import Player from "@/components/common/Player";
import Background from "../Background";
import Reconnect from "./Reconnect";
import InviteFriendsToast from "./InviteFriendsToast";
import DraggableOptions from "./DraggableOptions";
import { TUser } from "@/lib/types";

export default function Home({
  user,
  roomId,
}: {
  user: TUser;
  roomId?: string;
}) {
  return (
    <>
      <Background />
      <InviteFriendsToast />
      <Blur />
      <Reconnect />
      <DraggableOptions />
      <div className="bg-cover absolute w-full top-0 flex flex-col items-center justify-center h-full md:py-2.5">
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
