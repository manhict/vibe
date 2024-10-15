import { connectSpotify } from "@/app/actions/connectSpotify";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { FaSpotify } from "react-icons/fa";
async function page({ searchParams }: { searchParams: { code: string } }) {
  const code = searchParams.code;
  if (!code) return;
  const connected = await connectSpotify(code);
  const room = cookies().get("room")?.value;
  if (connected) redirect(`/v?room=${room}`);
  return (
    <div className=" flex text-7xl flex-col text-green-500 items-center justify-center h-screen">
      <FaSpotify />
      <p className=" text-lg text-center max-md:text-sm mt-2 text-white">
        {connected ? connected : "Something went wrong"}
      </p>
    </div>
  );
}

export default page;
