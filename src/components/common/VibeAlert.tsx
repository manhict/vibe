import React from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";

export default function VibeAlert({
  action,
  className,
  title,
  confirmText,
  heading,
  confirmClassName,
  headingClassName,
  disabled,
}: {
  className?: string;
  title: string;
  heading: string;
  confirmText: string;
  confirmClassName?: string;
  headingClassName?: string;
  disabled?: boolean;
  action: () => void;
}) {
  return (
    <Dialog>
      <DialogTrigger disabled={disabled} className=" disabled:opacity-50">
        <div
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 shadow h-8 rounded-lg px-3 w-fit text-xs bg-red-600/85 text-white hover:bg-red-600/70",
            className
          )}
        >
          {title}
        </div>
      </DialogTrigger>
      <DialogContent className="w-fit flex-col flex items-center justify-center bg-transparent border-none">
        <DialogHeader className=" h-0">
          <DialogTitle />
          <DialogDescription />
        </DialogHeader>
        <div
          className={cn(
            " p-5 marker: text-center flex flex-col gap-4 bg-gradient-to-t to-zinc-800/60  overflow-hidden from-zinc-600/50 gradient rounded-[28px] shadow-md text-xl font-semibold",
            headingClassName
          )}
        >
          <p>{heading}</p>
          <DialogClose className="gap-2 flex flex-col items-center">
            <Button
              variant={"purple"}
              className={cn(
                " bg-red-600/85 text-white hover:bg-red-600/70",
                confirmClassName
              )}
              onClick={action}
            >
              {confirmText}
            </Button>
            <Button className="w-full">Cancel</Button>
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
