import { searchSongResult } from "@/lib/types";
import { ytmusic } from "@/lib/ytMusic";
import { NextRequest, NextResponse } from "next/server";
import { Innertube } from "youtubei.js";
export async function GET(req: NextRequest) {
  try {
    await ytmusic.initialize({
      cookies: process.env.COOKIES,
    });

    const yt = await Innertube.create({
      cookie: process.env.COOKIES,
    });

    const page = req.nextUrl.searchParams.get("page");
    const search = req.nextUrl.searchParams.get("name");
    if (!search) throw new Error("Search not found");
    const [data, ytSongs, yt2Songs] = await Promise.all([
      await fetch(
        `${process.env.BACKEND_URI}/api/search/songs?query=${search}&page=${
          page || 0
        }`,
        {
          next: { revalidate: Infinity },
        }
      ),
      await ytmusic.searchSongs(search),
      await yt.search(search),
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

    const filterSongs = yt2Songs.results
      .filter((result) => result.type === "Video")
      .slice(0, 1);
    const songs2 = filterSongs.map((s: any) => ({
      id: s.id, // Video ID
      name: s.title.text, // Video title
      artists: {
        primary: [
          {
            id: s.author.id, // Author/Artist ID
            name: s.author.name, // Author/Artist name
            role: "", // You can assign a role if needed
            image: s.author.thumbnails.map((thumb: any) => ({
              url: thumb.url,
            })), // Author thumbnails
            type: "artist",
            url: s.author.url, // Author's YouTube channel URL
          },
        ],
      },
      image: [
        {
          quality: "500x500",
          url: `https://wsrv.nl/?url=${s.thumbnails[
            s.thumbnails.length - 1
          ].url.replace(/w\d+-h\d+/, "w500-h500")}`, // Resize thumbnail to 500x500
        },
      ],
      source: "youtube", // Specify the source
      downloadUrl: [
        {
          quality: "320kbps",
          url: `https://sstream.onrender.com/stream/${s.id}`, // Stream URL for the video
        },
      ],
    }));

    if (data.ok) {
      const result = (await data.json()) as searchSongResult;
      return NextResponse.json(
        {
          data: {
            ...result.data,
            results: [
              ...result.data.results.slice(0, 2),
              ...songs2,
              ...songs,
              ...result.data.results.slice(2, result.data.results.length - 1),
            ],
          },
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
