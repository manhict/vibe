import Blur from "@/components/Blur";
import HomeFooter from "@/components/common/HomeFooter";
import React from "react";

function page() {
  return (
    <>
      <Blur className=" blur-2xl bg-transparent" />
      <div className=" h-dvh w-dvw bg-[url('/background.webp')] bg-cover"></div>
      <HomeFooter />
    </>
  );
}

export default page;
