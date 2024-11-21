import { useUserContext } from "@/store/userStore";
import React from "react";
import Background from "../Background";
import InviteFriendsToast from "./InviteFriendsToast";
import Blur from "../Blur";
import Reconnect from "./Reconnect";

function Popups() {
  const { socketRef } = useUserContext();
  return (
    <>
      {socketRef.current.connected && (
        <>
          <Background />
          <InviteFriendsToast />
          <Blur />
          <Reconnect />
        </>
      )}
    </>
  );
}

export default Popups;
