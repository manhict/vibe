/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";
async function loadGoogleFont(font: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}:wght@500`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status === 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("Failed to load font data");
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "404";
    const imageUrl =
      searchParams.get("image") ||
      "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/TanmayIMG_4211.jpeg";

    const fontData = await loadGoogleFont("Geist");

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
            backgroundImage:
              'url("https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/Invite_Card_5.png")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            padding: "37px 30px",
            fontFamily: '"Geist", sans-serif',
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              width: "100%",
              height: "100%",
              background: "transparent",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "0px",
                background: "transparent",
                width: "65%",
              }}
            >
              <span
                style={{
                  fontSize: 45,
                  color: "#A78BFA",
                  fontWeight: "600",
                  letterSpacing: "-1px",
                  lineHeight: "1",
                }}
              >
                {name.split(" ")[0].charAt(0).toUpperCase() +
                  name.split(" ")[0].slice(1)}
                ,
              </span>
              <span
                style={{
                  fontSize: 44,
                  backgroundClip: "text",
                  backgroundImage:
                    "linear-gradient(to bottom right, #fff, #ffffff50)",
                  color: "transparent",
                  paddingBottom: "20px",
                  fontWeight: "500",
                  lineHeight: ".85",
                  letterSpacing: "-1px",
                }}
              >
                Invited you to vibe together.
              </span>
            </div>

            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                width: "100%",
              }}
            >
              <img
                src="https://getvibe.in/logo.svg"
                alt="Vibe Logo"
                style={{
                  width: "50.8",
                  height: "40.2px",
                }}
              />
              <span
                style={{
                  fontSize: 20,
                  color: "white",
                  fontWeight: 200,
                }}
              >
                getvibe.in
              </span>
            </div>
          </div>

          <img
            src={imageUrl}
            alt="Profile"
            style={{
              position: "absolute",
              top: "30px",
              right: "30px",
              width: "100px",
              height: "100px",
              objectFit: "cover",
              borderRadius: "100px",
              background: "transparent",
            }}
          />
        </div>
      ),
      {
        width: 600,
        height: 315,
        fonts: [
          {
            name: "Geist",
            data: fontData,
            style: "normal",
          },
        ],
      }
    );
  } catch (e) {
    return new Response(`Failed to generate the image`, {
      status: 500,
    });
  }
}
