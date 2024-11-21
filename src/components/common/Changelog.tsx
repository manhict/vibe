"use client";

import { marked } from "marked";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import React from "react";

const changelogContent = `
## What's New ⚡️

### 🎬 Latest Updates

<video autoplay playsinline loop muted>
  <source src="https://us-east-1.tixte.net/uploads/tanmay111-files.tixte.co/0C86F376-F67E-4778-A657-C6BDB82BF104.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

### ✨ New Features

- 🔖 **Copy-Paste to add song**: Copy song url from popular platforms like **YouTube** and **Spotify** and paste.
- 🚀 **Drag-drop to add song**: Drag and drop songs from popular platforms like **YouTube** and **Spotify**.
- 🧹 **Drag-drop to add and delete**: Easily drag and drop to add songs to another room or delete them.

### 📈 Improvements

- ⚡️ Increased page load speed by **40%** through code optimization.
- 🧑‍💻 Streamlined user onboarding process, reducing setup time by **50%**.
- 🔍 Enhanced search functionality with **auto-suggestions** and faster results.

### 🐞 Bug Fixes

- ✅ Fixed issue where user profile updates did not reflect immediately.

We're constantly working to improve your experience. Stay tuned for more updates! 🚀
`;

function ChangelogComp() {
  return (
    <Dialog>
      <DialogTrigger>
        <svg
          width="25"
          height="25"
          viewBox="0 0 25 25"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="hover:opacity-100 opacity-40 "
        >
          <path
            d="M22.5 12.7192C16.9785 12.7192 12.5 8.24067 12.5 2.71918C12.5 8.24067 8.0215 12.7192 2.5 12.7192C8.0215 12.7192 12.5 17.1977 12.5 22.7192C12.5 17.1977 16.9785 12.7192 22.5 12.7192Z"
            fill="#EADDFF"
          />
        </svg>
      </DialogTrigger>
      <DialogContent className="w-fit max-md:w-[85dvw] flex flex-col items-center justify-center bg-transparent border-none">
        <DialogHeader className="h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div className="h-[90dvh] flex items-center justify-center">
          <div className="flex backdrop-blur-xl flex-col  overflow-hidden p-0 items-center justify-center h-full border-2 border-white/15 bg-gradient-to-br from-black/45 to-black/25 rounded-[24px]">
            <div className="overflow-y-auto hide-scrollbar p-6 w-full h-full text-white">
              <div
                className="prose prose-invert max-md:prose-sm max-w-none"
                dangerouslySetInnerHTML={{
                  __html: marked.parse(changelogContent),
                }}
              />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
const Changelog = React.memo(ChangelogComp);
export default Changelog;
