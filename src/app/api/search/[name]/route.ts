import { searchSongResult } from "@/lib/types";
import { ytmusic } from "@/lib/ytMusic";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  params: { params: { name: string } }
) {
  try {
    await ytmusic.initialize({
      cookies: process.env.COOKIES,
    });

    const page = req.nextUrl.searchParams.get("page");

    const [data, ytSongs] = await Promise.all([
      await fetch(
        `${process.env.BACKEND_URI}/api/search/songs?query=${
          params.params.name
        }&page=${page || 0}`,
        {
          next: { revalidate: Infinity },
        }
      ),
      await ytmusic.searchSongs(params.params.name),
    ]);

    const songs = ytSongs.map((s) => ({
      id: s.videoId,
      name: s.name,
      artists: {
        primary: [
          {
            id: s.artist.artistId,
            name: s.artist.name,
            role: "",
            image: [],
            type: "artist",
            url: "",
          },
        ],
      },
      image: [
        {
          quality: "500x500",
          url: `https://wsrv.nl/?url=${s.thumbnails[
            s.thumbnails.length - 1
          ].url.replace(/w\d+-h\d+/, "w500-h500")}`,
        },
      ],
      source: "youtube",
      downloadUrl: [
        {
          quality: "320kbps",
          url: `https://sstream.onrender.com/stream/${s.videoId}`,
        },
      ],
    }));

    if (data.ok) {
      const result = (await data.json()) as searchSongResult;
      return NextResponse.json(
        {
          data: { ...result.data, results: [...songs, ...result.data.results] },
        },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Failed to fetch" }, { status: 500 });
    }
  } catch (error: any) {
    return NextResponse.json(
      { message: "Failed to fetch", error: error.message },
      { status: 500 }
    );
  }
}
