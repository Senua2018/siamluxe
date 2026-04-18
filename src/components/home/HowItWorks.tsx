"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Search, MessageSquare, Building2 } from "lucide-react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShineBorder } from "@/components/ui/shine-border";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  { key: "step1", icon: Search },
  { key: "step2", icon: MessageSquare },
  { key: "step3", icon: Building2 },
] as const;

export function HowItWorks() {
  const t = useTranslations("howItWorks");
  const timelineRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeline = timelineRef.current;
    const line = lineRef.current;
    if (!timeline || !line) return;

    const ctx = gsap.context(() => {
      gsap.from(line, {
        scaleX: 0,
        transformOrigin: "left center",
        duration: 1.5,
        ease: "power2.inOut",
        scrollTrigger: {
          trigger: timeline,
          start: "top 75%",
          toggleActions: "play none none none",
        },
      });
    }, timeline);

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-20 sm:py-28 bg-cream">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        {/* Header */}
        <BlurFade delay={0.1} inView>
          <div className="text-center mb-14 sm:mb-20">
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

        {/* Timeline */}
        <div ref={timelineRef} className="relative">
          {/* Connecting line (desktop only) */}
          <div
            ref={lineRef}
            className="hidden lg:block absolute top-[52px] left-[16.67%] right-[16.67%] h-px bg-gradient-to-r from-gold/30 via-gold/60 to-gold/30"
          />

          {/* Steps */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {STEPS.map(({ key, icon: Icon }, index) => (
              <BlurFade key={key} delay={0.2 + index * 0.15} inView>
                <div className="relative flex flex-col items-center text-center">
                  {/* Step number circle with shine */}
                  <ShineBorder
                    borderWidth={1}
                    duration={10}
                    shineColor={["#C5975B", "#D4AF72", "#8B6914"]}
                    className="relative z-10 !rounded-full w-[104px] h-[104px] flex items-center justify-center mb-8 !p-[1px]"
                  >
                    <div className="w-full h-full rounded-full bg-white-soft flex items-center justify-center shadow-warm">
                      <div className="absolute -top-2 -right-2 w-7 h-7 flex items-center justify-center rounded-full bg-gold shadow-warm">
                        <span className="font-[var(--font-montserrat)] text-xs font-bold text-white">
                          {index + 1}
                        </span>
                      </div>
                      <Icon className="w-8 h-8 text-gold-dark" strokeWidth={1.5} />
                    </div>
                  </ShineBorder>

                  {/* Mobile connector line */}
                  {index < STEPS.length - 1 && (
                    <div className="lg:hidden w-px h-8 bg-gradient-to-b from-gold/40 to-transparent -mt-4 mb-4" />
                  )}

                  {/* Title */}
                  <h3 className="font-[var(--font-playfair)] text-xl font-semibold text-text-primary mb-3">
                    {t(`${key}.title`)}
                  </h3>

                  {/* Separator */}
                  <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mb-3" />

                  {/* Description */}
                  <p className="font-[var(--font-cormorant)] text-base sm:text-lg text-text-secondary leading-relaxed max-w-xs">
                    {t(`${key}.description`)}
                  </p>
                </div>
              </BlurFade>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
