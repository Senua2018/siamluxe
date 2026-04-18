"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { BlurFade } from "@/components/ui/blur-fade";
import { ShimmerButton } from "@/components/ui/shimmer-button";

export function FinalCTA() {
  const t = useTranslations("cta");

  return (
    <section className="relative py-20 sm:py-28 overflow-hidden">
      {/* Gold gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-gold-dark via-gold to-gold-light" />

      {/* Subtle pattern overlay */}
      <div className="absolute inset-0 opacity-[0.06] bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20width%3D%2240%22%20height%3D%2240%22%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%3E%3Cpath%20d%3D%22M0%2040L40%200H20L0%2020M40%2040V20L20%2040%22%20fill%3D%22%23fff%22%20fill-opacity%3D%221%22/%3E%3C/svg%3E')]" />

      {/* Grain */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      <div className="relative z-10 mx-auto max-w-3xl px-5 sm:px-8 text-center">
        <BlurFade delay={0.1} inView>
          {/* Luxury divider */}
          <div className="luxury-divider mb-8">
            <span className="w-1.5 h-1.5 rotate-45 bg-white/40" />
          </div>

          <h2 className="font-[var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-5 text-embossed">
            {t("title")}
          </h2>

          <p className="font-[var(--font-cormorant)] text-lg sm:text-xl text-white/80 mb-10 max-w-lg mx-auto">
            {t("subtitle")}
          </p>

          <Link href="/contact">
            <ShimmerButton
              shimmerColor="#C5975B"
              background="rgba(255, 255, 255, 0.95)"
              className="px-10 py-4"
            >
              <span className="text-gold-dark">{t("button")}</span>
            </ShimmerButton>
          </Link>

          {/* Luxury divider */}
          <div className="luxury-divider mt-10">
            <span className="w-1.5 h-1.5 rotate-45 bg-white/30" />
          </div>
        </BlurFade>
      </div>
    </section>
  );
}
