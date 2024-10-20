import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./store/userStore";
import { AudioProvider } from "./store/AudioContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import Script from "next/script";
import GoogleAnalytics from "@/components/common/GoogleAnalytics";
const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});
export const metadata: Metadata = {
  title: "Vibe - Let Your Votes Choose the Beat",
  description:
    "Join Vibe, the collaborative music platform where your votes shape the playlist! Discover trending tracks, engage with a vibrant community, and enjoy a personalized listening experience. Start voting now to influence the beats you love",
  keywords: [
    "music",
    "collaborative playlists",
    "music voting platform",
    "trending music",
    "interactive music",
    "custom playlists",
    "community-driven playlists",
    "discover music",
    "vibe music",
  ],
  icons: { icon: "/favicon.png" },

  // OpenGraph Meta Tags
  openGraph: {
    title: "Vibe - Let Your Votes Choose the Beat",
    description:
      "Discover music collaboratively by letting your votes shape the playlist. Explore trending beats, vote, and experience a unique listening journey.",
    url: "https://getvibe.in", // Replace with your website URL
    type: "website",
    images: [
      {
        url: "https://getvibe.in/logo.svg", // Add Open Graph image
        width: 1200,
        height: 630,
        alt: "Vibe - Let Your Votes Choose the Beat",
      },
    ],
  },

  // Twitter Meta Tags
  twitter: {
    card: "summary_large_image",
    site: "@tanmay11117", // Replace with your Twitter handle
    title: "Vibe - Let Your Votes Choose the Beat",
    description:
      "Discover music collaboratively by letting your votes shape the playlist. Explore trending beats, vote, and experience a unique listening journey.",
    images: [
      {
        url: "https://getvibe.in/logo.svg",
        width: 1200,
        height: 630,
        alt: "Vibe - Collaborative Music Platform",
      },
      {
        url: "https://getvibe.in/og-image.jpg", // Add more image options for OpenGraph
        width: 800,
        height: 600,
        alt: "Vibe Music Collaboration",
      },
    ],
  },

  alternates: {
    canonical: "https://getvibe.in",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <GoogleTagManager gtmId="GTM-KS6FPVS3" />
      <GoogleAnalytics />
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <noscript
          dangerouslySetInnerHTML={{
            __html: `
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-KS6FPVS3"
                height="0"
                width="0"
                style="display:none;visibility:hidden"
              ></iframe>
            `,
          }}
        />
        <Suspense>
          <UserProvider>
            <AudioProvider>
              <Toaster
                position="bottom-left"
                visibleToasts={2}
                toastOptions={{
                  style: { background: "#6750A4" },
                  className: "rounded-xl w-fit text-white border-none",
                }}
              />
              {children}
            </AudioProvider>
          </UserProvider>
        </Suspense>
      </body>
      <Script id="seo" async type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Vibe",
          url: "https://getvibe.in",
          description:
            "A collaborative music platform where votes shape playlists.",
        })}
      </Script>
    </html>
  );
}
