"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import useEmblaCarousel from "embla-carousel-react";
import AutoPlay from "embla-carousel-autoplay";
import { Star } from "lucide-react";
import { DEMO_TESTIMONIALS } from "@/lib/demo-data";
import { getLocalizedField } from "@/types";
import type { Locale } from "@/types";
import { BlurFade } from "@/components/ui/blur-fade";

export function Testimonials() {
  const t = useTranslations("testimonials");
  const locale = useLocale() as Locale;
  const [selectedIndex, setSelectedIndex] = useState(0);

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, align: "center" },
    [AutoPlay({ delay: 5000, stopOnInteraction: true })]
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
  }, [emblaApi, onSelect]);

  return (
    <section className="py-20 sm:py-28 bg-white-soft">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-14 sm:mb-16">
            <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-text-primary mb-4 text-embossed">
              {t("title")}
            </h2>
            <div className="luxury-divider mb-5">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold" />
            </div>
            <p className="font-[var(--font-cormorant)] text-lg sm:text-xl text-text-secondary max-w-xl mx-auto">
              {t("subtitle")}
            </p>
          </div>
        </BlurFade>

        {/* Carousel */}
        <div className="overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {DEMO_TESTIMONIALS.map((testimonial) => {
              const quote = getLocalizedField(testimonial, "quote", locale);

              return (
                <div
                  key={testimonial.id}
                  className="flex-[0_0_100%] sm:flex-[0_0_80%] lg:flex-[0_0_50%] min-w-0 px-3 sm:px-4"
                >
                  <div className="relief-card rounded-xl p-8 sm:p-10 h-full flex flex-col">
                    {/* Quote mark */}
                    <span className="text-gold/25 font-[var(--font-playfair)] text-6xl leading-none select-none mb-2">
                      &ldquo;
                    </span>

                    {/* Quote text */}
                    <p className="font-[var(--font-cormorant)] text-lg sm:text-xl text-text-primary leading-relaxed italic flex-1 -mt-6">
                      {quote}
                    </p>

                    {/* Separator */}
                    <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent my-6" />

                    {/* Author */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-gold/20 shadow-warm">
                        <Image
                          src={testimonial.author_avatar_url}
                          alt={testimonial.author_name}
                          fill
                          className="object-cover"
                          sizes="48px"
                        />
                      </div>
                      <div>
                        <h4 className="font-[var(--font-montserrat)] text-sm font-semibold text-text-primary">
                          {testimonial.author_name}
                        </h4>
                        <p className="font-[var(--font-montserrat)] text-xs text-text-secondary">
                          {testimonial.author_nationality}
                        </p>
                      </div>
                      <div className="ml-auto flex gap-0.5">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star
                            key={i}
                            className="w-3.5 h-3.5 text-gold fill-gold"
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Dots */}
        <div className="flex items-center justify-center gap-2 mt-8">
          {DEMO_TESTIMONIALS.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={`h-2 rounded-full transition-all duration-300 ${
                index === selectedIndex
                  ? "w-8 bg-gold"
                  : "w-2 bg-gold/25 hover:bg-gold/40"
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
