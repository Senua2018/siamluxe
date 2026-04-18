"use client";

import { useTranslations } from "next-intl";
import { NumberTicker } from "@/components/ui/number-ticker";
import { BlurFade } from "@/components/ui/blur-fade";

export function TrustBanner() {
  const t = useTranslations("trust");

  const stats = [
    { end: 24, suffix: "+", label: t("salonsAvailable") },
    { end: 15, suffix: "", label: t("districtsAvailable") },
    { end: 12, suffix: "+", label: t("nationalitiesServed") },
    { end: 8, suffix: "", label: t("yearsExperience") },
  ];

  return (
    <section className="relative py-16 sm:py-20 bg-white-soft inner-depth">
      {/* Top gold line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />

      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-4">
          {stats.map((stat, i) => (
            <BlurFade key={stat.label} delay={0.1 * i} inView>
              <div className="flex flex-col items-center gap-2 px-4">
                <span className="font-[var(--font-playfair)] text-4xl sm:text-5xl lg:text-6xl font-bold text-gold-gradient text-embossed">
                  <NumberTicker value={stat.end} delay={0.3 + i * 0.15} />
                  {stat.suffix}
                </span>
                <span className="font-[var(--font-montserrat)] text-xs sm:text-sm font-medium tracking-[0.15em] uppercase text-text-secondary">
                  {stat.label}
                </span>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>

      {/* Bottom gold line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-gold/30 to-transparent" />
    </section>
  );
}
