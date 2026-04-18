"use client";

import { useRef } from "react";
import {
  AnimatePresence,
  motion,
  useInView,
  type Variant,
} from "motion/react";
import { cn } from "@/lib/utils";

interface BlurFadeProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  direction?: "up" | "down" | "left" | "right";
  inView?: boolean;
  blur?: string;
  offset?: number;
}

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.4,
  direction = "up",
  inView = true,
  blur = "6px",
  offset = 6,
}: BlurFadeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });
  const shouldAnimate = !inView || isInView;

  const directionMap: Record<string, { x?: number; y?: number }> = {
    up: { y: offset },
    down: { y: -offset },
    left: { x: offset },
    right: { x: -offset },
  };

  const hidden: Variant = {
    ...directionMap[direction],
    opacity: 0,
    filter: `blur(${blur})`,
  };
  const visible: Variant = {
    x: 0,
    y: 0,
    opacity: 1,
    filter: "blur(0px)",
  };

  return (
    <AnimatePresence>
      <motion.div
        ref={ref}
        initial={hidden}
        animate={shouldAnimate ? visible : hidden}
        transition={{
          delay: 0.04 + delay,
          duration,
          ease: "easeOut",
        }}
        className={cn(className)}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}
