"use client";

import { useRef, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronDown } from "lucide-react";
import { ShimmerButton } from "@/components/ui/shimmer-button";

gsap.registerPlugin(ScrollTrigger);

export function Hero() {
  const t = useTranslations("hero");
  const sectionRef = useRef<HTMLElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const overlayRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const image = imageRef.current;
    const overlay = overlayRef.current;
    if (!section || !image || !overlay) return;

    const ctx = gsap.context(() => {
      gsap.to(image, {
        yPercent: 30,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
      });

      gsap.to(overlay, {
        opacity: 0.8,
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
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
      className="relative h-screen min-h-[700px] overflow-hidden flex items-center justify-center"
    >
      {/* Background Image with Parallax */}
      <div
        ref={imageRef}
        className="absolute inset-0 -top-[10%] -bottom-[10%] will-change-transform"
      >
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1560750588-73207b1ef5b8?w=1920&q=80&auto=format&fit=crop')",
          }}
        />
      </div>

      {/* Gradient Overlay */}
      <div
        ref={overlayRef}
        className="absolute inset-0 bg-gradient-to-b from-black-rich/50 via-black-rich/40 to-black-rich/70"
      />

      {/* Subtle grain texture */}
      <div className="absolute inset-0 grain-overlay pointer-events-none" />

      {/* Floating gold particles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-gold-light/30"
            style={{
              left: `${15 + i * 18}%`,
              top: `${20 + i * 12}%`,
            }}
            animate={{
              y: [0, -30, 0],
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              duration: 4 + i,
              repeat: Infinity,
              ease: "easeInOut",
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 mx-auto max-w-5xl px-5 sm:px-8 text-center">
        {/* Luxury divider top */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="luxury-divider mb-8"
        >
          <span className="w-1.5 h-1.5 rotate-45 bg-gold-light" />
        </motion.div>

        {/* Main Title */}
        <motion.h1
          initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 1, delay: 0.5 }}
          className="font-[var(--font-playfair)] text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight"
        >
          {t("title")}
          <br />
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
            className="text-gold-light font-light italic text-embossed"
          >
            {t("titleHighlight")}
          </motion.span>
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          transition={{ duration: 0.8, delay: 1 }}
          className="mt-6 sm:mt-8 font-[var(--font-cormorant)] text-lg sm:text-xl md:text-2xl text-white/75 max-w-2xl mx-auto leading-relaxed"
        >
          {t("subtitle")}
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.3 }}
          className="mt-10 sm:mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <Link href="/salons">
            <ShimmerButton
              shimmerColor="#D4AF72"
              background="rgba(197, 151, 91, 0.9)"
              className="px-10 py-4"
            >
              {t("cta")}
            </ShimmerButton>
          </Link>
          <Link
            href="/about"
            className="font-[var(--font-montserrat)] text-sm font-medium tracking-wider uppercase px-10 py-4 rounded-full border border-white/20 text-white/90 transition-all duration-500 hover:border-gold-light/60 hover:text-gold-light backdrop-blur-sm"
          >
            {t("ctaSecondary")}
          </Link>
        </motion.div>

        {/* Luxury divider bottom */}
        <motion.div
          initial={{ opacity: 0, scaleX: 0 }}
          animate={{ opacity: 1, scaleX: 1 }}
          transition={{ duration: 1, delay: 1.6, ease: "easeOut" }}
          className="luxury-divider mt-12"
        >
          <span className="w-1.5 h-1.5 rotate-45 bg-gold-light/50" />
        </motion.div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 1 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          className="flex flex-col items-center gap-2"
        >
          <div className="w-px h-8 bg-gradient-to-b from-transparent to-gold-light/60" />
          <ChevronDown className="w-4 h-4 text-gold-light/60" />
        </motion.div>
      </motion.div>
    </section>
  );
}
