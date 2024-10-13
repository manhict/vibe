"use client";

import { useUserContext } from "@/app/store/userStore";
import { Heart } from "lucide-react";
import { useCallback } from "react";

const LikeButton = () => {
  const { user } = useUserContext();
  const handleClick = useCallback(
    (event: React.MouseEvent) => {
      const xPos = event.clientX;
      const yPos = event.clientY;

      // Create a div for the background image
      const imageEl = document.createElement("div");
      const imageE2 = document.createElement("div");
      imageEl.style.zIndex = "100";
      imageEl.style.position = "absolute";
      imageEl.style.left = xPos + "px";
      imageEl.style.top = yPos + "px";

      // Set a random size up to a maximum of 50px
      const size = Math.random() * 40; // Generates a number between 0 and 50
      imageEl.style.width = size + "px";
      imageEl.style.height = size + "px";
      imageEl.style.right = xPos - size + "px"; // Same position as image
      imageEl.style.top = yPos + 20 + "px";
      imageEl.style.background = `url('${user?.imageUrl}')`; // Background image
      imageEl.style.backgroundSize = "cover"; // Ensure the image covers the div
      imageEl.style.borderRadius = "50%"; // Make it rounded
      imageEl.style.pointerEvents = "none"; // Disable pointer events
      imageEl.style.animation = "heartAnimation 6s linear"; // Set the animation
      imageEl.style.opacity = "20";

      imageE2.style.zIndex = "100";
      imageE2.style.position = "absolute";
      imageE2.style.left = xPos + "px";
      imageE2.style.top = yPos + "px";
      imageE2.style.width = size + "px";
      imageE2.style.height = size + "px";
      imageE2.style.right = xPos + "px"; // Same position as image
      imageE2.style.top = yPos + 20 + "px";
      imageE2.style.background = `url('${user?.imageUrl}')`; // Background image
      imageE2.style.backgroundSize = "cover"; // Ensure the image covers the div
      imageE2.style.borderRadius = "50%"; // Make it rounded
      imageE2.style.pointerEvents = "none"; // Disable pointer events
      imageE2.style.animation = "heartAnimation 6s linear"; // Set the animation
      imageE2.style.opacity = "20";
      // Create a div for the heart emoji
      const heartEl = document.createElement("div");
      heartEl.style.zIndex = "100";
      heartEl.style.opacity = "20";
      heartEl.textContent = "❤️"; // Heart emoji
      heartEl.style.position = "absolute"; // Position relative to the parent
      heartEl.style.left = xPos + 20 + "px"; // Same position as image
      heartEl.style.top = yPos + 20 + "px"; // Same position as image
      heartEl.style.fontSize = size / 1 + "px"; // Set the font size to half of the image size
      heartEl.style.pointerEvents = "none"; // Disable pointer events
      heartEl.style.animation = "heartAnimation 6s linear"; // Set the same animation
      const heartE2 = document.createElement("div");
      heartE2.style.zIndex = "100";
      heartE2.style.opacity = "20";
      heartE2.textContent = "❤️"; // Heart emoji
      heartE2.style.position = "absolute"; // Position relative to the parent
      heartE2.style.left = xPos - 30 + "px"; // Same position as image
      heartE2.style.top = yPos - 10 + "px"; // Same position as image
      heartE2.style.fontSize = size / 1 + "px"; // Set the font size to half of the image size
      heartE2.style.pointerEvents = "none"; // Disable pointer events
      heartE2.style.animation = "heartAnimation 6s linear"; // Set the same animation

      // Append both elements to the body
      document.body.appendChild(imageEl);
      document.body.appendChild(heartEl);
      document.body.appendChild(heartE2);
      document.body.appendChild(imageE2);

      // Remove both elements after the animation completes (6 seconds)
      setTimeout(() => {
        imageEl.remove();
        heartE2.remove();
        heartEl.remove();
        imageE2.remove();
      }, 3000);
    },
    [user?.imageUrl]
  );

  return (
    <Heart
      onClick={handleClick}
      size={22}
      className=" hover:opacity-70 opacity-40 transition-all duration-500 cursor-pointer"
    />
  );
};

export default LikeButton;
