import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./store/userStore";
import { AudioProvider } from "./store/AudioContext";
import { Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
import Head from "next/head";
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
    "Discover music collaboratively by letting your votes shape the playlist. Explore trending beats, vote, and experience a unique listening journey.",
  keywords: "music, voting, playlist, beats, trending, collaborative music",
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
      <Head>
        {/* JSON-LD Schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "MusicGroup",
              name: "Vibe",
              url: "https://getvibe.in",
              description:
                "Discover music collaboratively by letting your votes shape the playlist. Explore trending beats, vote, and experience a unique listening journey.",
              image: "https://getvibe.in/logo.svg",
              sameAs: ["https://twitter.com/tanmay11117"],
            }),
          }}
        />
      </Head>
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
    </html>
  );
}
