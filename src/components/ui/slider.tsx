"use client";

import * as React from "react";
import * as SliderPrimitive from "@radix-ui/react-slider";

import { cn } from "@/lib/utils";

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      "relative flex w-full group touch-none select-none items-center",
      className
    )}
    {...props}
  >
    <SliderPrimitive.Track className="  relative h-[0.30rem] cursor-pointer w-full grow overflow-hidden rounded-full bg-primary/20">
      <SliderPrimitive.Range className="absolute h-full bg-purple " />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb className="block group-hover:opacity-100 opacity-0  h-2.5 w-2.5 rounded-full border border-primary/10 bg-purple  shadow transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50" />
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

export { Slider };
