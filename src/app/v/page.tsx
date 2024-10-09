import Home from "@/components/common/Home";
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/roomModel";
import RoomUser from "@/models/roomUsers";
import User from "@/models/userModel";
import { Metadata } from "next";

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};
export async function generateMetadata({
  searchParams,
}: Props): Promise<Metadata> {
  await dbConnect();
  const room = searchParams["room"];
  const username = searchParams["ref"];
  let user = null;
  if (username) {
    user = await User.findOne({ username });
  } else {
    if (room) {
      const roomId = await Room.findOne({ roomId: room });
      user = (
        await RoomUser.findOne({ roomId: roomId?._id, role: "admin" }).populate(
          "userId"
        )
      ).userId;
    }
  }
  if (!user) return {};
  return {
    title: `${user?.name || "404"} Vibe`,
    description: `${user?.name || "404"}'s Inviting you to listen together`,
    icons: [
      {
        rel: "icon",
        url: user?.imageUrl || "/",
      },
    ],
    openGraph: {
      images: [
        {
          url: user?.imageUrl || "/",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@tanmay11117",
      title: `${user?.name} Vibe`,
      description: `${user?.name} is listening on Vibe`,
      images: user?.imageUrl || "/",
    },
  };
}
export default async function page() {
  return <Home />;
}
