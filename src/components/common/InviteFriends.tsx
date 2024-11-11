"use client";
import Listeners from "./Listeners";
import Youtube from "./Youtube";
import { useCallback } from "react";
import { toast } from "sonner";
import { useUserContext } from "@/store/userStore";
import { cn } from "@/lib/utils";
function InviteFriends({ className }: { className?: string }) {
  const { roomId, user } = useUserContext();
  const handleShare = useCallback(async () => {
    if (!user) return;
    const shareUrl = `${window.location.origin}/${roomId}&ref=${user.username}`;

    try {
      if (navigator.share) {
        // In Browser: Use Web Share API
        await navigator.share({ url: shareUrl });
        toast.success("Shared the link successfully!");
      } else {
        // Fallback: Copy to clipboard in unsupported browsers
        await navigator.clipboard.writeText(shareUrl);
        toast.success("Link copied to clipboard!");
      }
    } catch (error: any) {}
  }, [roomId, user]);
  return (
    <div className={cn(" flex items-center justify-between pr-4", className)}>
      <Listeners className=" max-md:hidden" />
      <div className=" flex items-center gap-1">
        <div
          onClick={handleShare}
          className="inline-flex cursor-pointer items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 text-secondary-foreground shadow-sm h-8 rounded-lg px-2.5 text-xs gap-1 bg-purple w-fit hover:bg-[#7140c5]"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M9.94995 12.25C9.51245 12.25 9.14058 12.0969 8.83433 11.7906C8.52808 11.4844 8.37495 11.1125 8.37495 10.675C8.37495 10.6137 8.37933 10.5503 8.38808 10.4847C8.39683 10.4191 8.40995 10.36 8.42745 10.3075L4.7262 8.155C4.57745 8.28625 4.4112 8.38906 4.22745 8.46344C4.0437 8.53781 3.8512 8.575 3.64995 8.575C3.21245 8.575 2.84058 8.42187 2.53433 8.11562C2.22808 7.80937 2.07495 7.4375 2.07495 7C2.07495 6.5625 2.22808 6.19062 2.53433 5.88437C2.84058 5.57812 3.21245 5.425 3.64995 5.425C3.8512 5.425 4.0437 5.46219 4.22745 5.53656C4.4112 5.61094 4.57745 5.71375 4.7262 5.845L8.42745 3.6925C8.40995 3.64 8.39683 3.58094 8.38808 3.51531C8.37933 3.44969 8.37495 3.38625 8.37495 3.325C8.37495 2.8875 8.52808 2.51562 8.83433 2.20937C9.14058 1.90312 9.51245 1.75 9.94995 1.75C10.3875 1.75 10.7593 1.90312 11.0656 2.20937C11.3718 2.51562 11.525 2.8875 11.525 3.325C11.525 3.7625 11.3718 4.13437 11.0656 4.44062C10.7593 4.74687 10.3875 4.9 9.94995 4.9C9.7487 4.9 9.5562 4.86281 9.37245 4.78844C9.1887 4.71406 9.02245 4.61125 8.8737 4.48L5.17245 6.6325C5.18995 6.685 5.20308 6.74406 5.21183 6.80969C5.22058 6.87531 5.22495 6.93875 5.22495 7C5.22495 7.06125 5.22058 7.12469 5.21183 7.19031C5.20308 7.25594 5.18995 7.315 5.17245 7.3675L8.8737 9.52C9.02245 9.38875 9.1887 9.28594 9.37245 9.21156C9.5562 9.13719 9.7487 9.1 9.94995 9.1C10.3875 9.1 10.7593 9.25312 11.0656 9.55937C11.3718 9.86562 11.525 10.2375 11.525 10.675C11.525 11.1125 11.3718 11.4844 11.0656 11.7906C10.7593 12.0969 10.3875 12.25 9.94995 12.25ZM9.94995 3.85C10.0987 3.85 10.2234 3.79969 10.324 3.69906C10.4246 3.59844 10.475 3.47375 10.475 3.325C10.475 3.17625 10.4246 3.05156 10.324 2.95094C10.2234 2.85031 10.0987 2.8 9.94995 2.8C9.8012 2.8 9.67651 2.85031 9.57589 2.95094C9.47526 3.05156 9.42495 3.17625 9.42495 3.325C9.42495 3.47375 9.47526 3.59844 9.57589 3.69906C9.67651 3.79969 9.8012 3.85 9.94995 3.85ZM3.64995 7.525C3.7987 7.525 3.92339 7.47469 4.02401 7.37406C4.12464 7.27344 4.17495 7.14875 4.17495 7C4.17495 6.85125 4.12464 6.72656 4.02401 6.62594C3.92339 6.52531 3.7987 6.475 3.64995 6.475C3.5012 6.475 3.37651 6.52531 3.27589 6.62594C3.17526 6.72656 3.12495 6.85125 3.12495 7C3.12495 7.14875 3.17526 7.27344 3.27589 7.37406C3.37651 7.47469 3.5012 7.525 3.64995 7.525ZM9.94995 11.2C10.0987 11.2 10.2234 11.1497 10.324 11.0491C10.4246 10.9484 10.475 10.8237 10.475 10.675C10.475 10.5262 10.4246 10.4016 10.324 10.3009C10.2234 10.2003 10.0987 10.15 9.94995 10.15C9.8012 10.15 9.67651 10.2003 9.57589 10.3009C9.47526 10.4016 9.42495 10.5262 9.42495 10.675C9.42495 10.8237 9.47526 10.9484 9.57589 11.0491C9.67651 11.1497 9.8012 11.2 9.94995 11.2Z"
              fill="white"
            />
          </svg>

          <span>Invite Friends</span>
        </div>
        <Youtube />
      </div>
    </div>
  );
}

export default InviteFriends;
