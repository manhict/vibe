import { NextRequest, NextResponse } from "next/server";
import { generateRoomId } from "./utils/utils";

export default async function middleware(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const vibeId = req.cookies.get("vibeId")?.value;
    const room = url.searchParams.get("room");
    const accessToken = url.searchParams.get("vibe_token");
    if (accessToken) {
      const response = NextResponse.redirect(
        new URL(`${url.pathname}/${room}`, req.url) // Redirect to the same URL with the room
      );

      await response.cookies.set("vibeId", accessToken, {
        httpOnly: true,
        sameSite: "strict",
        secure: true,
        path: "/",
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      });

      return response;
    }
    if (url.pathname == "/") {
      const isLoggedIn = await fetch(`${process.env.SOCKET_URI}/api/@me`, {
        headers: {
          Authorization: `Bearer ${vibeId}`,
        },
      });
      if (isLoggedIn.ok) {
        return NextResponse.redirect(new URL("/browse", req.nextUrl.origin));
      }
    }

    if (url.pathname.startsWith("/v")) {
      if (room) {
        const res = NextResponse.next();
        res.cookies.set("room", room, { path: "/", httpOnly: true });
        return res;
      }
      if (!room) {
        const newRoomId = generateRoomId();
        const res = NextResponse.redirect(
          new URL(`${url.pathname}?room=${newRoomId}&new=true`, req.url)
        );
        res.cookies.set("room", newRoomId, { path: "/", httpOnly: true });
        return res;
      }
    }
    return NextResponse.next();
  } catch (error) {
    return NextResponse.next();
  }
}
