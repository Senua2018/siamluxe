"use client";

import { cn } from "@/lib/utils";
import type { CSSProperties, ReactNode } from "react";

interface ShineBorderProps {
  borderWidth?: number;
  duration?: number;
  shineColor?: string | string[];
  className?: string;
  children?: ReactNode;
}

export function ShineBorder({
  borderWidth = 1,
  duration = 14,
  shineColor = ["#C5975B", "#D4AF72", "#8B6914"],
  className,
  children,
}: ShineBorderProps) {
  return (
    <div
      style={
        {
          "--border-width": `${borderWidth}px`,
          "--shine-pulse-duration": `${duration}s`,
          "--shine-color": Array.isArray(shineColor)
            ? shineColor.join(", ")
            : shineColor,
          backgroundImage: `linear-gradient(var(--cream, #FDF8F0), var(--cream, #FDF8F0)), linear-gradient(to right, ${Array.isArray(shineColor) ? shineColor.join(", ") : shineColor})`,
        } as CSSProperties
      }
      className={cn(
        "relative rounded-xl bg-clip-padding p-[var(--border-width)]",
        "animate-shine-pulse [background-size:200%_100%,100%_100%] [background-clip:padding-box,border-box] [background-origin:padding-box,border-box]",
        className,
      )}
    >
      {children}
    </div>
  );
}
