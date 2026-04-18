"use client";

import { useTranslations } from "next-intl";
import { MapPin, Globe, ShieldCheck, Scale } from "lucide-react";
import { BlurFade } from "@/components/ui/blur-fade";
import { BorderBeam } from "@/components/ui/border-beam";

const FEATURES = [
  { key: "expertise", icon: MapPin },
  { key: "multilingual", icon: Globe },
  { key: "verified", icon: ShieldCheck },
  { key: "legal", icon: Scale },
] as const;

export function WhyUs() {
  const t = useTranslations("whyUs");

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

        {/* Features Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {FEATURES.map(({ key, icon: Icon }, index) => (
            <BlurFade key={key} delay={0.15 + index * 0.1} inView>
              <div className="group relative relief-card rounded-xl p-7 sm:p-8 text-center transition-all duration-500 hover:-translate-y-1.5 overflow-hidden">
                {/* Border beam on hover */}
                <BorderBeam
                  size={60}
                  duration={8}
                  delay={index * 1.5}
                  colorFrom="#C5975B"
                  colorTo="#D4AF72"
                  borderWidth={1}
                />

                {/* Icon */}
                <div className="mx-auto w-14 h-14 flex items-center justify-center rounded-full bg-gold/10 mb-6 transition-all duration-500 group-hover:bg-gold/20 group-hover:scale-110">
                  <Icon className="w-6 h-6 text-gold-dark" strokeWidth={1.5} />
                </div>

                {/* Title */}
                <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-3">
                  {t(`${key}.title`)}
                </h3>

                {/* Gold separator */}
                <div className="w-8 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-3 transition-all duration-500 group-hover:w-12" />

                {/* Description */}
                <p className="font-[var(--font-cormorant)] text-base text-text-secondary leading-relaxed">
                  {t(`${key}.description`)}
                </p>
              </div>
            </BlurFade>
          ))}
        </div>
      </div>
    </section>
  );
}
