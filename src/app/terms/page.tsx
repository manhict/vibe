import Terms from "./Terms";

export async function generateMetadata() {
  return {
    title: `Vibe Terms of Service`,
    description: `Democratic Music Selection:`,

    icons: { icon: "/favicon.png" },
    openGraph: {
      title: "Vibe",
      description:
        "Explore, vote, and enjoy a community-driven music experience where your votes decide the beats.",
      url: "https://getvibe.in",
      type: "website",
      images: [
        {
          url: "https://getvibe.in/logo.svg",
          width: 1200,
          height: 630,
          alt: "Vibe",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      site: "@tanmay11117",
      title: "Vibe",
      description:
        "Discover, vote, and influence the playlist in real-time on Vibe, the collaborative music platform.",
      images: [
        {
          url: "https://getvibe.in/logo.svg",
          width: 1200,
          height: 630,
          alt: "Vibe - Collaborative Music Platform",
        },
        {
          url: "https://getvibe.in/logo.svg",
          width: 800,
          height: 600,
          alt: "Vibe Music Collaboration",
        },
      ],
    },
  };
}

function page() {
  return <Terms />;
}

export default page;
