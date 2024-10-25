import { NextRequest, NextResponse } from "next/server";
import { generateRoomId } from "./utils/utils";

export default function middleware(req: NextRequest) {
  const url = new URL(req.url);

  const room = url.searchParams.get("room");

  if (room) {
    const res = NextResponse.next();
    res.cookies.set("room", room, { path: "/", httpOnly: true });
    return res;
  }
  if (url.pathname.startsWith("/v")) {
    if (!room) {
      const newRoomId = generateRoomId();
      const res = NextResponse.redirect(
        new URL(`${url.pathname}?room=${newRoomId}`, req.url)
      );
      res.cookies.set("room", newRoomId, { path: "/", httpOnly: true });
      return res;
    }
  }

  return NextResponse.next();
}
