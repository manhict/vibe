import { artists } from "@/lib/types";

export const formatArtistName = (artists: artists[]) => {
  return artists
    .map((data, index) => {
      if (index === artists.length - 1) {
        return `${data.name}`;
      }
      return `${data.name}, ${data.name}`;
    })
    .join("");
};
export function formatElapsedTime(seconds: number): string {
  if (isNaN(seconds) || seconds < 0) {
    return "0:00";
  }
  const totalSeconds = Math.floor(seconds);

  const minutes = Math.floor(totalSeconds / 60);
  const remainingSeconds = totalSeconds % 60;

  return `${minutes}:${
    remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds
  }`;
}

export function generateRoomId(length = 8) {
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let roomId = "";
  for (let i = 0; i < length; i++) {
    roomId += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return roomId;
}

export const setCookie = (name: string, value: string) => {
  document.cookie = `${name}=${value};path=/`;
};

export const isImageUrl = (url: string): boolean => {
  return /^https?:\/\/.*\.(jpg|jpeg|png|gif|webp)$/i.test(url);
};

export const linkifyOptions = {
  target: "_blank",
  nl2br: true,
  className: "custom-link",
};

export function extractPlaylistID(url: string) {
  try {
    // Create a new URL object to parse the input URL
    const urlObj = new URL(url);

    // Get the value of the 'list' parameter, which is the playlist ID
    return urlObj.searchParams.get("list");
  } catch (error) {
    return null;
  }
}
