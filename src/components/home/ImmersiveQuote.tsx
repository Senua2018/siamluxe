"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlurFade } from "@/components/ui/blur-fade";

gsap.registerPlugin(ScrollTrigger);

export function ImmersiveQuote() {
  const t = useTranslations("immersive");
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    if (!section || !image) return;

    const ctx = gsap.context(() => {
      gsap.to(image, {
        yPercent: 20,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="relative h-[60vh] min-h-[400px] overflow-hidden flex items-center justify-center"
    >
      {/* Parallax Background */}
      <div
        ref={imageRef}
        className="absolute inset-0 -top-[15%] -bottom-[15%] will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1519046904884-53103b34b206?w=1920&q=80&auto=format&fit=crop')",
          }}
        />
      </div>

      {/* Dark + Gold overlay */}
      <div className="absolute inset-0 bg-black-rich/60" />
      <div className="absolute inset-0 bg-gradient-to-r from-gold-dark/10 via-transparent to-gold-dark/10" />

      {/* Grain texture */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-4xl px-6 sm:px-8 text-center">
        <BlurFade delay={0.2} inView blur="10px" duration={0.8}>
          {/* Decorative quote mark */}
          <div className="text-gold-light/30 font-[var(--font-playfair)] text-8xl sm:text-9xl leading-none mb-2 select-none">
            &ldquo;
          </div>

          <blockquote className="font-[var(--font-playfair)] text-xl sm:text-2xl md:text-3xl lg:text-4xl font-light text-white leading-snug sm:leading-relaxed italic -mt-12 sm:-mt-16 text-embossed">
            {t("quote")}
          </blockquote>

          <div className="mt-8">
            <div className="luxury-divider mb-4">
              <span className="w-1.5 h-1.5 rotate-45 bg-gold-light/40" />
            </div>
            <cite className="font-[var(--font-montserrat)] text-xs font-semibold tracking-[0.25em] uppercase text-gold-light not-italic">
              — {t("author")}
            </cite>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
