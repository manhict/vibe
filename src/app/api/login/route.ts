import dbConnect from "@/lib/dbConnect";
import User from "@/models/userModel";
import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { User as userType } from "firebase/auth";

const jwt_secret = process.env.JWT_SECRET || "";

export async function POST(req: NextRequest) {
  try {
    await dbConnect();
    const data: userType = await req.json();
    const isAlready = await User.findOne({ email: data.email });
    if (isAlready) {
      const user = await User.findOneAndUpdate(
        { email: data.email },
        { imageUrl: data.photoURL, name: data.providerData[0].displayName },
        { new: true }
      );
      return proceed(isAlready, user);
    } else {
      const user = await User.create({
        username: data.email?.split("@gmail.com")[0],
        name: data.providerData[0].displayName,
        email: data.email,
        imageUrl: data.photoURL,
      });

      if (user) {
        return proceed(user);
      }
    }

    return NextResponse.json({ success: false, data: {} }, { status: 500 });
  } catch (error: any) {
    console.log(error);

    return NextResponse.json(
      { success: false, data: {}, message: error?.message },
      { status: 500 }
    );
  }
}

const proceed = (saved: any, user?: any) => {
  const accessToken = jwt.sign({ userId: saved._id }, jwt_secret, {
    expiresIn: "7d",
  });

  // Create a response and set the cookie
  const response = NextResponse.json({ success: true, data: user || saved });

  response.cookies.set("vibeId", accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure: true,
    path: "/",
    expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Current date + 7 days
  });
  return response;
};
