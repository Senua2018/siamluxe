"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion, type Transition } from "framer-motion";

const STAT_VALUES = ["Sukhumvit & Silom", "$40k → $150k", "+30%", "12+"] as const;
const STAT_KEYS = ["zones", "price", "roi", "count"] as const;

type FadeUpProps = {
  initial: { opacity: number; y: number };
  animate: { opacity: number; y: number };
  transition: Transition;
};

const fadeUp = (delay: number): FadeUpProps => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.9, delay, ease: [0.25, 0.46, 0.45, 0.94] },
});

export function HeroSection() {
  const t = useTranslations("hero");

  return (
    <section className="relative w-full h-screen min-h-[700px] overflow-hidden flex items-stretch">

      {/* ── Vidéo background ── */}
      <video
        autoPlay
        loop
        muted
        playsInline
        aria-hidden="true"
        poster="/assets/images/hero-fallback.jpg"
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="/assets/videos/hero.mp4" type="video/mp4" />
      </video>

      {/* ── Overlay ── */}
      <div className="absolute inset-0 bg-[rgba(10,6,3,0.42)]" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_30%,rgba(10,6,3,0.38)_100%)]" />
      <div className="absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[rgba(10,6,3,0.55)] to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[rgba(10,6,3,0.60)] to-transparent" />

      {/* ── Coins dorés ── */}
      <div className="absolute top-4 left-4 w-7 h-7 border-t border-l border-[#C9A96E] z-10 sm:top-5 sm:left-5 sm:w-8 sm:h-8" />
      <div className="absolute top-4 right-4 w-7 h-7 border-t border-r border-[#C9A96E] z-10 sm:top-5 sm:right-5 sm:w-8 sm:h-8" />
      <div className="absolute bottom-4 left-4 w-7 h-7 border-b border-l border-[#C9A96E] z-10 sm:bottom-5 sm:left-5 sm:w-8 sm:h-8" />
      <div className="absolute bottom-4 right-4 w-7 h-7 border-b border-r border-[#C9A96E] z-10 sm:bottom-5 sm:right-5 sm:w-8 sm:h-8" />

      {/* ── Layout split ── */}
      <div className="relative z-10 w-full flex flex-col md:grid md:grid-cols-2">

        {/* Colonne gauche */}
        <div className="flex flex-col justify-center px-8 pt-20 pb-8 md:px-14 md:py-0 md:border-r md:border-[rgba(201,169,110,0.15)]">
          <motion.p
            {...fadeUp(0.3)}
            className="font-[var(--font-josefin)] font-[100] text-[10px] tracking-[0.38em] uppercase text-[#C9A96E] mb-4"
          >
            {t("eyebrow")}
          </motion.p>

          <motion.div
            {...fadeUp(0.45)}
            className="w-[70px] h-px bg-[#C9A96E] opacity-75 mb-5"
          />

          <motion.h1 {...fadeUp(0.6)} className="font-[var(--font-cormorant)] font-[300] text-[#FDFAF5] leading-[0.88] mb-5">
            <span className="block text-[72px] sm:text-[82px] md:text-[90px]">
              {t("title")}
            </span>
            <motion.em
              {...fadeUp(0.75)}
              className="block not-italic italic text-[82px] sm:text-[92px] md:text-[100px]"
            >
              {t("titleItalic")}
            </motion.em>
          </motion.h1>

          <motion.p
            {...fadeUp(0.9)}
            className="font-[var(--font-cormorant)] italic text-[13px] sm:text-[15px] text-[rgba(253,250,245,0.55)] leading-relaxed max-w-[280px]"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* Colonne droite */}
        <div className="flex flex-col justify-end md:justify-center px-8 pb-16 md:px-14 md:py-0">

          {/* Stats — grille 2×2 sur mobile, liste sur desktop */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-5 md:flex md:flex-col md:gap-5 mb-8">
            {STAT_KEYS.map((key, i) => (
              <motion.div
                key={key}
                {...fadeUp(0.8 + i * 0.1)}
                className="border-l border-[rgba(201,169,110,0.5)] pl-3 md:pl-4"
              >
                <div className="font-[var(--font-josefin)] font-[100] text-[18px] md:text-[26px] text-[#C9A96E] leading-tight mb-1">
                  {STAT_VALUES[i]}
                </div>
                <div className="font-[var(--font-josefin)] font-[300] text-[8px] md:text-[9px] tracking-[0.22em] uppercase text-[rgba(253,250,245,0.45)] leading-snug">
                  {t(`stats.${key}`)}
                </div>
              </motion.div>
            ))}
          </div>

          {/* CTA */}
          <motion.div {...fadeUp(1.2)}>
            <Link
              href="/salons"
              className="inline-block font-[var(--font-josefin)] font-[300] text-[10px] tracking-[0.3em] uppercase bg-[#C9A96E] text-[#2A1506] px-8 py-3.5 hover:opacity-85 transition-opacity duration-300"
            >
              {t("cta")}
            </Link>
          </motion.div>
        </div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ opacity: [0.4, 1, 0.4] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="w-px h-9 bg-gradient-to-b from-transparent to-[rgba(201,169,110,0.65)]"
        />
        <span className="font-[var(--font-josefin)] font-[100] text-[8px] tracking-[0.4em] uppercase text-[rgba(201,169,110,0.55)]">
          {t("explore")}
        </span>
      </motion.div>

    </section>
  );
}
