"use client";

import { useEffect } from "react";
import Image from "next/image";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import { GALLERY_IMAGES } from "@/lib/demo-data";

export function Gallery() {
  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: true,
      align: "start",
      dragFree: true,
      containScroll: false,
    },
    [AutoPlay({ delay: 3000, stopOnInteraction: false, stopOnMouseEnter: true })]
  );

  useEffect(() => {
    if (!emblaApi) return;
  }, [emblaApi]);

  return (
    <section className="py-4 sm:py-6 bg-cream overflow-hidden">
      <div ref={emblaRef} className="overflow-hidden cursor-grab active:cursor-grabbing">
        <div className="flex gap-3 sm:gap-4">
          {GALLERY_IMAGES.map((src, index) => (
            <div
              key={index}
              className="relative flex-[0_0_75%] sm:flex-[0_0_40%] lg:flex-[0_0_28%] aspect-[3/2] rounded-lg overflow-hidden"
            >
              <Image
                src={src}
                alt={`Gallery ${index + 1}`}
                fill
                className="object-cover transition-transform duration-700 hover:scale-105"
                sizes="(max-width: 640px) 75vw, (max-width: 1024px) 40vw, 28vw"
              />
              {/* Subtle gold border on hover */}
              <div className="absolute inset-0 border border-transparent hover:border-gold/20 rounded-lg transition-colors duration-500" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
