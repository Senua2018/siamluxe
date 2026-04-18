"use client";

import { type CSSProperties, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ShimmerButtonProps {
  shimmerColor?: string;
  shimmerSize?: string;
  borderRadius?: string;
  shimmerDuration?: string;
  background?: string;
  className?: string;
  children?: ReactNode;
  onClick?: () => void;
  href?: string;
}

export function ShimmerButton({
  shimmerColor = "#D4AF72",
  shimmerSize = "0.05em",
  borderRadius = "100px",
  shimmerDuration = "3s",
  background = "rgba(61, 43, 31, 1)",
  className,
  children,
  ...props
}: ShimmerButtonProps & React.ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      style={
        {
          "--shimmer-color": shimmerColor,
          "--shimmer-size": shimmerSize,
          "--border-radius": borderRadius,
          "--shimmer-duration": shimmerDuration,
          "--background": background,
        } as CSSProperties
      }
      className={cn(
        "group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap px-8 py-3.5 text-white [border-radius:var(--border-radius)]",
        "transform-gpu transition-transform duration-300 ease-in-out active:translate-y-px",
        className,
      )}
      {...props}
    >
      {/* spark container */}
      <div className="absolute inset-0 overflow-visible [container-type:size]">
        {/* spark */}
        <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
          {/* spark before */}
          <div className="absolute -inset-full w-auto rotate-0 animate-spin-around [background:conic-gradient(from_calc(270deg-(var(--shimmer-size)*0.5)),transparent_0,var(--shimmer-color)_var(--shimmer-size),transparent_var(--shimmer-size))] [translate:0_0]" />
        </div>
      </div>
      {/* backdrop */}
      <div className="absolute [background:var(--background)] [border-radius:var(--border-radius)] [inset:1px]" />
      {/* content */}
      <span className="relative z-10 font-[var(--font-montserrat)] text-sm font-semibold tracking-wide">
        {children}
      </span>
    </button>
  );
}
