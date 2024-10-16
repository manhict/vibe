import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";
import ytpl from "ytpl";
import jwt from "jsonwebtoken";
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const roomID = req.nextUrl.searchParams.get("room");
  const session = cookies().get("vibeId");
  if (!session || !session.value) {
    throw new Error("No session found");
  }
  const decoded: any = jwt.verify(session.value, process.env.JWT_SECRET || "");
  if (!decoded || !decoded.userId) {
    throw new Error("Invalid token");
  }
  if (!id) throw new Error("Invalid song ID");
  if (!roomID) throw new Error("Invalid room ID");
  try {
    const playlist = await ytpl(id, {
      pages: 1,
    });
    if (!playlist.items) throw new Error("Invalid playlist");
    const tracks = playlist.items.map((s) => ({
      id: s.id,
      name: s.title,
      artists: {
        primary: [
          {
            id: s.author.channelID,
            name: s.author.name,
            role: "",
            image: [],
            type: "artist",
            url: s.author.url,
          },
        ],
      },
      addedBy: decoded.userId,
      image: [
        {
          quality: "500x500",
          url: `https://wsrv.nl/?url=${s.thumbnails[
            s.thumbnails.length - 1
          ].url?.replace(/w\d+-h\d+/, "w500-h500")}`,
        },
      ],
      source: "youtube",
      downloadUrl: [
        {
          quality: "320kbps",
          url: `https://sstream.onrender.com/stream/${s.id}`,
        },
      ],
    }));

    return NextResponse.json(tracks);
  } catch (error: any) {
    console.log(error?.message);
    return NextResponse.json(
      { msg: "Error importing playlist" },
      { status: 500 }
    );
  }
}
