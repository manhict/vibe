"use server";
import dbConnect from "@/lib/dbConnect";
import Room from "@/models/roomModel";
import RoomUser from "@/models/roomUsers";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
const client_id = process.env.SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL || "";
export async function getLoggedInUser() {
  try {
    await dbConnect();

    const session = cookies().get("vibeId");
    const roomId = cookies().get("room")?.value;
    if (!session || !session.value) {
      throw new Error("No session found");
    }

    const decoded: any = jwt.verify(
      session.value,
      process.env.JWT_SECRET || ""
    );
    if (!decoded || !decoded.userId) {
      throw new Error("Invalid token");
    }

    const [user, room] = await Promise.all([
      await User.findById(decoded.userId), // Fetch the user by ID
      await Room.findOne({ roomId }), // Fetch the room by roomId
    ]);

    const role = await RoomUser.findOne({
      userId: decoded.userId,
      roomId: room?._id,
    }).select("role spotifyData");

    const refresh_token = await fetch(
      "https://accounts.spotify.com/api/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: user?.spotifyData?.refresh_token,
          redirect_uri: redirect_uri,
          client_id: client_id,
          client_secret: client_secret,
        }),
      }
    );

    if (refresh_token.ok) {
      const spotifyData = await refresh_token.json();
      await User.findByIdAndUpdate(decoded.userId, {
        "spotifyData.access_token": spotifyData.access_token,
      });
    }

    return JSON.parse(
      JSON.stringify({
        ...user.toObject(),
        token: session.value,
        roomId: roomId,
        role: role?.toObject()?.role || "guest",
        spotify: refresh_token.status === 200,
      })
    );
  } catch (error: any) {
    console.error("Error in getLoggedInUser:", error.message);
    return null;
  }
}
