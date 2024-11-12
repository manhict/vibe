/* eslint-disable @next/next/no-img-element */
import { ImageResponse } from "next/og";

async function loadGoogleFont(font: string, text: string) {
  const url = `https://fonts.googleapis.com/css2?family=${font}&text=${encodeURIComponent(
    text
  )}`;
  const css = await (await fetch(url)).text();
  const resource = css.match(
    /src: url\((.+)\) format\('(opentype|truetype)'\)/
  );

  if (resource) {
    const response = await fetch(resource[1]);
    if (response.status == 200) {
      return await response.arrayBuffer();
    }
  }

  throw new Error("failed to load font data");
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const name = searchParams.get("name") || "404";
    const imageUrl =
      searchParams.get("image") ||
      "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/TanmayIMG_4211.jpeg";

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
              'url("https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/Invite_Card.jpg")',
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            padding: "40px",
            fontFamily: "Geist, sans-serif",
          }}
        >
          <div
            style={{
              display: "flex",
              position: "relative",
              padding: "20px",
              background: "#18181B",
              borderRadius: "24px",
              boxShadow: "0 0 100px rgba(147, 51, 234, 0.5)",
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
                style={{ display: "flex", flexDirection: "column", gap: "8px" }}
              >
                <span
                  style={{
                    fontSize: 54,
                    color: "#A78BFA",
                    fontWeight: 600,
                  }}
                >
                  {name.split(" ")[0]}
                </span>
                <span
                  style={{
                    fontSize: 54,
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  invited you to
                </span>
                <span
                  style={{
                    fontSize: 54,
                    color: "white",
                    fontWeight: 700,
                  }}
                >
                  vibe together.
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
                    width: "55px",
                    height: "45px",
                  }}
                />
                <span
                  style={{
                    fontSize: 20,
                    color: "white",
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
                top: "20px",
                right: "20px",
                width: "140px",
                height: "140px",
                objectFit: "cover",
                borderRadius: "100px",
              }}
            />
          </div>
        </div>
      ),
      {
        width: 736,
        height: 464,
        fonts: [
          {
            name: "Geist",
            data: await loadGoogleFont("Geist", name),
            style: "normal",
            weight: 800,
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

export const runtime = "edge";
