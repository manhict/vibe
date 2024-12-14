import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "@/store/userStore";
import { AudioProvider } from "@/store/AudioContext";
import { GoogleTagManager } from "@next/third-parties/google";
import { Suspense } from "react";
import { SocketProvider } from "@/Hooks/useSocket";
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
  title: "Vibe",
  description: "Let votes decide the beat",
  manifest: "/manifest.json",
  keywords: [
    "music",
    "collaborative playlists",
    "music voting platform",
    "trending music",
    "interactive music",
    "community-driven playlists",
    "discover music",
    "vibe music",
  ],
  icons: { icon: "/favicon.png" },

  // OpenGraph Meta Tags
  openGraph: {
    title: "Vibe",
    description: "Let votes decide the beat",
    url: "https://getvibe.in",
    type: "website",
    siteName: "Vibe", // Add this line for site_name
    images: [
      {
        url: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/OGIMG.png",
        width: 1200,
        height: 630,
        alt: "Vibe",
      },
    ],
  },

  // Twitter Meta Tags
  twitter: {
    card: "summary_large_image",
    site: "@tanmay11117",
    title: "Vibe",
    description: "Let votes decide the beat",
    images: [
      {
        url: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/OGIMG.png",
        width: 1200,
        height: 630,
        alt: "Vibe",
      },
      {
        url: "https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/OGIMG.png",
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
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {/* <noscript
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
        /> */}
        <Suspense>
          <UserProvider>
            <AudioProvider>
              <SocketProvider>
                <Toaster
                  position="bottom-right"
                  visibleToasts={2}
                  toastOptions={{
                    classNames: {
                      error:
                        "bg-red-500 rounded-xl w-fit right-0 text-white border-none",
                    },
                    className:
                      "bg-[#6750A4] rounded-xl w-fit right-0 text-white border-none",
                  }}
                />
                {children}
              </SocketProvider>
            </AudioProvider>
          </UserProvider>
        </Suspense>
      </body>
    </html>
  );
}
