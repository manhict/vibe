import { connectSpotify } from "@/app/actions/connectSpotify";

import { FaSpotify } from "react-icons/fa";
import Connect from "./Connect";
async function page({ searchParams }: { searchParams: { code: string } }) {
  const code = searchParams.code;
  if (!code) return;
  const connected = await connectSpotify(code);

  if (connected) {
    return <Connect data={connected} />;
  }
  return (
    <div className=" flex text-7xl flex-col text-green-500 items-center justify-center h-screen">
      <FaSpotify />
      <p className=" text-lg text-center max-md:text-sm mt-2 text-white">
        Something went wrong
      </p>
    </div>
  );
}

export default page;
