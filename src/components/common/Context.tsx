"use client";
import React, { useCallback } from "react";
import { ContextMenuContent, ContextMenuItem } from "../ui/context-menu";
import { toast } from "sonner";
import { useUserContext } from "@/store/userStore";

function Context() {
  const { setIsChatOpen, isChatOpen } = useUserContext();
  const { roomId, user } = useUserContext();
  const handleShare = useCallback(async () => {
    if (!user) return;
    const shareUrl = `${window.location.origin}/v?room=${roomId}&ref=${user.username}`;

    try {
      await navigator.clipboard.writeText(shareUrl);
      toast.success("Link copied to clipboard!");
    } catch (error: any) {}
  }, [roomId, user]);
  return (
    <ContextMenuContent>
      <ContextMenuItem onClick={() => (window.location.href = "/browse")}>
        Your Rooms
      </ContextMenuItem>
      <ContextMenuItem onClick={() => setIsChatOpen((prev) => !prev)}>
        {isChatOpen ? "Close Chat" : " Open Chat"}
      </ContextMenuItem>
      <ContextMenuItem
        className=" opacity-50"
        onClick={() => toast.info("Coming soon")}
      >
        Add to Room
      </ContextMenuItem>
      <ContextMenuItem onClick={handleShare}>Invite Friend</ContextMenuItem>
    </ContextMenuContent>
  );
}

export default Context;
