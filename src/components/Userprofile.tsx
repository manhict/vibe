"use client";
import { TUser } from "@/lib/types";
import Profile from "./common/Profile";

function Userprofile({ user, roomId }: { user: TUser; roomId?: string }) {
  return <Profile user={user} roomId={roomId} />;
}

export default Userprofile;
