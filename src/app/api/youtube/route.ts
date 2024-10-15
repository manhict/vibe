import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/queueModel";
import Room from "@/models/roomModel";
import { NextRequest, NextResponse } from "next/server";
import ytpl from "ytpl";
export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  const roomID = req.nextUrl.searchParams.get("room");
  if (!id) throw new Error("Invalid song ID");
  if (!roomID) throw new Error("Invalid room ID");
  try {
    await dbConnect();

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
    const room = await Room.findOne({ roomId: roomID });
    if (!room) throw new Error("room not found");
    // Bulk insert all tracks into the queue
    const queueItems = tracks.map((track) => ({
      roomId: room._id,
      isPlaying: false, // Default state, adjust as needed
      songData: track,
    }));

    // Insert all items in bulk to the database
    await Queue.insertMany(queueItems);

    return NextResponse.json(tracks);
  } catch (error: any) {
    console.log(error?.message);
    return NextResponse.json(
      { msg: "Error importing playlist" },
      { status: 500 }
    );
  }
}
