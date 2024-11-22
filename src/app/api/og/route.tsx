/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "Fellow";
    // const imageUrl =
    //   searchParams.get("image") ||
    //   "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/TanmayIMG_4211.jpeg";

    return new ImageResponse(
      (
        <div
      style={{
        height: "100%",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        backgroundImage:'url("https://getvibe.in/InviteCardBase.png")',
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        padding: "35px 50px",
        fontFamily: '"Geist", sans-serif',
      }}
    >
      <div
        style={{
          display: "flex",
          position: "relative",
          width: "100%",
          height: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            width: "100%",
            height: "100%",
          }}
        >
          <div
            style={{ display: "flex", flexDirection: "column", gap: "10px",background:"transparent",width:'65%'}}
          >
            <span
              style={{
                fontSize: '8cqi',
                color: "#D0BCFF",
                fontWeight: '500',
                letterSpacing:'-1px',
                lineHeight:'.9',
              }}
            >
              {name.split(" ")[0]},
            </span>
            <span
              style={{
                fontSize: '8cqi',
                color: "#ffffff",
                fontWeight: '400',
                lineHeight:'1',
                letterSpacing:'-2.5px',
                // background:'linear-gradient(135deg, rgba(255,255,255,1) 0%, rgba(255,255,255,0.5018382352941176) 100%);'
              }}
            >
             invited you to vibe together.
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-end",
              width: "100%",
            }}
          >
            <img
              src="https://getvibe.in/logo.svg"
              alt="Vibe Logo"
              style={{
                height: '90%',
                width: 'auto',
              }}
            />
            <span
              style={{
                fontSize: '3cqi',
                color: "#ffffff",
                fontWeight: 300,
              }}
            >
              getvibe.in
            </span>
          </div>
        </div>
      </div>
    </div>
      ),
      {
        width: 600,
        height: 315,
      }
    );
  } catch (e) {
    console.error(e);
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}

export const runtime = "edge";
