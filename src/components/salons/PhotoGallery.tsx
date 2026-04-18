"use client";

import { useState, useCallback, useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import { ChevronLeft, ChevronRight, X, Expand } from "lucide-react";
import type { SalonPhoto } from "@/types";
import { AnimatePresence, motion } from "framer-motion";

interface PhotoGalleryProps {
  photos: SalonPhoto[];
  title: string;
}

export function PhotoGallery({ photos, title }: PhotoGalleryProps) {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);

  const [mainRef, mainApi] = useEmblaCarousel({ loop: true });
  const [thumbRef, thumbApi] = useEmblaCarousel({
    containScroll: "keepSnaps",
    dragFree: true,
  });

  const onMainSelect = useCallback(() => {
    if (!mainApi || !thumbApi) return;
    setSelectedIndex(mainApi.selectedScrollSnap());
    thumbApi.scrollTo(mainApi.selectedScrollSnap());
  }, [mainApi, thumbApi]);

  useEffect(() => {
    if (!mainApi) return;
    mainApi.on("select", onMainSelect);
    onMainSelect();
  }, [mainApi, onMainSelect]);

  const scrollPrev = useCallback(() => mainApi?.scrollPrev(), [mainApi]);
  const scrollNext = useCallback(() => mainApi?.scrollNext(), [mainApi]);

  const onThumbClick = useCallback(
    (index: number) => {
      if (!mainApi) return;
      mainApi.scrollTo(index);
    },
    [mainApi]
  );

  if (photos.length === 0) {
    return (
      <div className="aspect-[16/9] bg-cream flex items-center justify-center rounded-xl">
        <span className="text-text-secondary/40 font-[var(--font-montserrat)] text-sm">
          No photos available
        </span>
      </div>
    );
  }

  return (
    <>
      {/* Main Carousel */}
      <div className="relative group">
        <div ref={mainRef} className="overflow-hidden rounded-xl">
          <div className="flex">
            {photos.map((photo, index) => (
              <div
                key={photo.id || index}
                className="relative flex-[0_0_100%] min-w-0 aspect-[16/10] sm:aspect-[16/9]"
              >
                <Image
                  src={photo.url}
                  alt={`${title} — Photo ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 66vw"
                  priority={index === 0}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Navigation arrows */}
        {photos.length > 1 && (
          <>
            <button
              onClick={scrollPrev}
              className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-warm text-text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
              aria-label="Previous photo"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={scrollNext}
              className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-warm text-text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
              aria-label="Next photo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Fullscreen button */}
        <button
          onClick={() => setFullscreen(true)}
          className="absolute bottom-3 right-3 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-warm text-text-primary opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
          aria-label="Fullscreen"
        >
          <Expand className="w-4 h-4" />
        </button>

        {/* Counter */}
        <div className="absolute bottom-3 left-3 px-3 py-1 bg-black-rich/60 backdrop-blur-sm rounded-full">
          <span className="font-[var(--font-montserrat)] text-xs font-medium text-white">
            {selectedIndex + 1} / {photos.length}
          </span>
        </div>
      </div>

      {/* Thumbnails */}
      {photos.length > 1 && (
        <div ref={thumbRef} className="overflow-hidden mt-3">
          <div className="flex gap-2">
            {photos.map((photo, index) => (
              <button
                key={photo.id || index}
                onClick={() => onThumbClick(index)}
                className={`relative flex-[0_0_20%] sm:flex-[0_0_16%] min-w-0 aspect-[4/3] rounded-lg overflow-hidden transition-all duration-300 ${
                  index === selectedIndex
                    ? "ring-2 ring-gold opacity-100"
                    : "opacity-50 hover:opacity-80"
                }`}
              >
                <Image
                  src={photo.url}
                  alt={`Thumbnail ${index + 1}`}
                  fill
                  className="object-cover"
                  sizes="120px"
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Fullscreen Modal */}
      <AnimatePresence>
        {fullscreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black-rich/95 flex items-center justify-center"
            onClick={() => setFullscreen(false)}
          >
            <button
              onClick={() => setFullscreen(false)}
              className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors z-10"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>

            <div
              className="relative w-full h-full max-w-5xl max-h-[85vh] mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <Image
                src={photos[selectedIndex].url}
                alt={`${title} — Photo ${selectedIndex + 1}`}
                fill
                className="object-contain"
                sizes="100vw"
              />
            </div>

            {/* Fullscreen navigation */}
            {photos.length > 1 && (
              <>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((i) => (i - 1 + photos.length) % photos.length);
                  }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Previous"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedIndex((i) => (i + 1) % photos.length);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-colors"
                  aria-label="Next"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
