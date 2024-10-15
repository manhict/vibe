import dbConnect from "@/lib/dbConnect";
import Queue from "@/models/queueModel";
import Room from "@/models/roomModel";
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
    const room = await Room.findOne({ roomId: roomID });
    if (!room) throw new Error("room not found");
    // Bulk insert all tracks into the queue
    const queueItems = tracks.map((track) => ({
      roomId: room._id,
      isPlaying: false, // Default state, adjust as needed
      songData: track,
    }));

    // Extract unique track IDs from the new tracks
    const trackIds = tracks.map((track) => track.id);

    // Find existing tracks in the queue with matching track IDs
    const existingTracks = await Queue.find({
      roomId: room._id,
      "songData.id": { $in: trackIds }, // Match tracks by their unique ID
    });

    // Extract the IDs of tracks already in the queue
    const existingTrackIds = existingTracks.map(
      (queueItem) => queueItem.songData.id
    );

    // Filter out the tracks that already exist in the queue
    const newTracksToInsert = queueItems.filter(
      (queueItem) => !existingTrackIds.includes(queueItem.songData.id)
    );

    // Insert only the non-duplicate tracks in bulk to the database
    if (newTracksToInsert.length > 0) {
      await Queue.insertMany(newTracksToInsert);
    }

    return NextResponse.json(tracks);
  } catch (error: any) {
    console.log(error?.message);
    return NextResponse.json(
      { msg: "Error importing playlist" },
      { status: 500 }
    );
  }
}
