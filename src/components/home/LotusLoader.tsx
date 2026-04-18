// src/components/home/LotusLoader.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useLotusScene } from "@/hooks/useLotusScene";

interface LotusLoaderProps {
  videoLoaded: boolean;
  onDismissed?: () => void;
}

export function LotusLoader({ videoLoaded, onDismissed }: LotusLoaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [fading, setFading] = useState(false);
  const [textVisible, setTextVisible] = useState(false);
  const [progressWidth, setProgressWidth] = useState(0);
  const mountedAt = useRef(Date.now());

  useLotusScene(canvasRef, {
    scale: 1.0,
    enableMouseParallax: true,
    showTorus: true,
  });

  // "Siam Luxe" text fades in at 0.8s
  useEffect(() => {
    const t = setTimeout(() => setTextVisible(true), 800);
    return () => clearTimeout(t);
  }, []);

  // Progress bar: trigger CSS transition on next paint
  useEffect(() => {
    const raf = requestAnimationFrame(() => setProgressWidth(100));
    return () => cancelAnimationFrame(raf);
  }, []);

  // Dismiss after video ready (minimum 2s visible)
  useEffect(() => {
    if (!videoLoaded) return;
    const elapsed = Date.now() - mountedAt.current;
    const wait = Math.max(0, 2000 - elapsed);
    const t = setTimeout(() => {
      setFading(true);
      setTimeout(() => onDismissed?.(), 1200);
    }, wait);
    return () => clearTimeout(t);
  }, [videoLoaded, onDismissed]);

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden grain-animated"
      style={{
        background: "#2E1B12",
        opacity: fading ? 0 : 1,
        transition: fading ? "opacity 1.2s ease-out" : "none",
        pointerEvents: fading ? "none" : "auto",
      }}
    >
      {/* Three.js canvas — fills the container */}
      <canvas
        ref={canvasRef}
        aria-hidden="true"
        className="absolute inset-0 w-full h-full"
      />

      {/* "Siam Luxe" label — centred below the lotus */}
      <div
        className="absolute inset-x-0 flex justify-center"
        style={{ top: "62%" }}
      >
        <p
          style={{
            fontFamily: "var(--font-cormorant)",
            fontStyle: "italic",
            fontSize: "clamp(28px, 4vw, 40px)",
            color: "#FDFAF5",
            letterSpacing: "0.08em",
            opacity: textVisible ? 1 : 0,
            transition: "opacity 0.8s ease-out",
            userSelect: "none",
          }}
        >
          Siam Luxe
        </p>
      </div>

      {/* Progress bar — 1px gold line at bottom */}
      <div className="absolute bottom-0 inset-x-0 overflow-hidden" style={{ height: "1px" }}>
        <div
          style={{
            height: "1px",
            background:
              "linear-gradient(90deg, transparent, #C9A96E, #E2C898, #C9A96E, transparent)",
            width: `${progressWidth}%`,
            transition:
              progressWidth === 100 ? "width 2.5s ease-out" : "none",
          }}
        />
      </div>
    </div>
  );
}
