"use server";

import { spotifyToken } from "@/lib/types";
import User from "@/models/userModel";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/dbConnect";

const client_id = process.env.SPOTIFY_CLIENT_ID || "";
const client_secret = process.env.SPOTIFY_CLIENT_SECRET || "";
const redirect_uri = process.env.SPOTIFY_REDIRECT_URL || "";

export async function connectSpotify(code: string) {
  try {
    const response = await fetch("https://accounts.spotify.com/api/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: redirect_uri,
        client_id: client_id,
        client_secret: client_secret,
      }),
    });

    if (response.ok) {
      const spotifyData = (await response.json()) as spotifyToken;

      // Get session cookie (vibeId)
      const session = cookies().get("vibeId");
      if (!session || !session.value) {
        throw new Error("No session found");
      }

      // Verify and decode the session token
      const decoded: any = jwt.verify(
        session.value,
        process.env.JWT_SECRET || ""
      );
      if (!decoded || !decoded.userId) {
        throw new Error("Invalid token");
      }

      // Connect to the database
      await dbConnect();

      // Update user's Spotify data
      await User.findByIdAndUpdate(decoded.userId, {
        spotifyData,
      });

      return "Successfully Connected. Now you can close this window.";
    }

    return null;
  } catch (error) {
    console.error("SPOTIFY ERROR", error);
    return null;
  }
}
