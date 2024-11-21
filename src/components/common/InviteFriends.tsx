"use client";
import Listeners from "./Listeners";
import Youtube from "./Youtube";
import React from "react";
import { cn } from "@/lib/utils";
import InviteButton from "./inviteButton";

function InviteFriendsComp({ className }: { className?: string }) {
  return (
    <div className={cn(" flex items-center justify-between pr-4", className)}>
      <Listeners className=" max-md:hidden" />
      <div className=" flex items-center gap-1">
        <InviteButton />
        <Youtube />
      </div>
    </div>
  );
}
const InviteFriends = React.memo(InviteFriendsComp);
export default InviteFriends;
