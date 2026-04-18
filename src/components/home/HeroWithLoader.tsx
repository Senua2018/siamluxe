// src/components/home/HeroWithLoader.tsx
"use client";

import { useState } from "react";
import { LotusLoader } from "@/components/home/LotusLoader";
import { HeroSection } from "@/components/home/HeroSection";

export function HeroWithLoader() {
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [loaderDismissed, setLoaderDismissed] = useState(false);

  return (
    <>
      {!loaderDismissed && (
        <LotusLoader
          videoLoaded={videoLoaded}
          onDismissed={() => setLoaderDismissed(true)}
        />
      )}
      <HeroSection onVideoReady={() => setVideoLoaded(true)} />
    </>
  );
}
