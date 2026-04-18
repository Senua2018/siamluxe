"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { ArrowRight } from "lucide-react";
import type { Salon, SalonPhoto } from "@/types";
import { SalonCard } from "@/components/salons/SalonCard";
import { BlurFade } from "@/components/ui/blur-fade";

type Props = {
  salons: (Salon & { salon_photos: SalonPhoto[] })[];
};

export function FeaturedSalons({ salons }: Props) {
  const t = useTranslations("featured");

  return (
    <section className="py-20 sm:py-28 bg-cream">
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

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-5">
          {salons.map((salon, i) => (
            <BlurFade key={salon.id} delay={0.15 + i * 0.1} inView>
              <SalonCard salon={salon} />
            </BlurFade>
          ))}
        </div>

        {/* View All CTA */}
        <BlurFade delay={0.5} inView>
          <div className="text-center mt-12 sm:mt-16">
            <Link
              href="/salons"
              className="inline-flex items-center gap-2 font-[var(--font-montserrat)] text-sm font-semibold tracking-wider uppercase text-gold-dark hover:text-gold transition-colors duration-300 group"
            >
              {t("viewAll")}
              <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
