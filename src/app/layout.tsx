import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { Toaster } from "sonner";
import { UserProvider } from "./store/userStore";
import { AudioProvider } from "./store/AudioContext";
import { Suspense } from "react";
import { GoogleTagManager } from "@next/third-parties/google";
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
  description: "Vote to play next!",
  icons: ["/favicon.png"],
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
        <noscript
          dangerouslySetInnerHTML={{
            __html: (
              <iframe
                src="https://www.googletagmanager.com/ns.html?id=GTM-KS6FPVS3"
                height="0"
                width="0"
                style={{ display: "none", visibility: "hidden" }}
              ></iframe>
            ),
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
