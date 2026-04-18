// src/components/home/LotusSection.tsx
"use client";

import { useRef, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { useLotusScene } from "@/hooks/useLotusScene";

export function LotusSection() {
  const t = useTranslations("lotusSection");
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [hasEntered, setHasEntered] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        const visible = entry.isIntersecting;
        setIsVisible(visible);
        if (visible) setHasEntered(true);
      },
      { threshold: 0.2 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  useLotusScene(canvasRef, {
    scale: 0.7,
    enableMouseParallax: false,
    showTorus: false,
    active: isVisible,
  });

  return (
    <section
      ref={sectionRef}
      className="relative flex items-center overflow-hidden grain-animated"
      style={{ minHeight: "100vh", background: "#2E1B12" }}
    >
      <div className="relative z-10 w-full flex flex-col-reverse md:flex-row items-center px-8 md:px-16 lg:px-24 gap-12 md:gap-0 py-20 md:py-0">

        {/* Text block — left on desktop */}
        <div
          className="w-full md:w-[45%]"
          style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? "translateX(0)" : "translateX(-30px)",
            transition: "opacity 0.9s ease-out 0.2s, transform 0.9s ease-out 0.2s",
          }}
        >
          <p
            style={{
              fontFamily: "var(--font-josefin)",
              fontWeight: 100,
              fontSize: "10px",
              color: "#C9A96E",
              letterSpacing: "0.5em",
              textTransform: "uppercase",
              marginBottom: "12px",
            }}
          >
            {t("eyebrow")}
          </p>

          <div
            style={{
              width: "60px",
              height: "1px",
              background: "#C9A96E",
              marginBottom: "20px",
            }}
          />

          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontSize: "clamp(32px, 4vw, 52px)",
              color: "#FDFAF5",
              lineHeight: 1.05,
              marginBottom: "24px",
            }}
          >
            {t("title")}
          </h2>

          <p
            style={{
              fontFamily: "var(--font-cormorant)",
              fontStyle: "italic",
              fontSize: "18px",
              color: "rgba(253,250,245,0.60)",
              lineHeight: 1.7,
              maxWidth: "380px",
            }}
          >
            {t("body")}
          </p>
        </div>

        {/* Canvas — right on desktop */}
        <div
          className="w-full md:w-[55%] flex justify-center"
          style={{
            opacity: hasEntered ? 1 : 0,
            transform: hasEntered ? "translateX(0)" : "translateX(30px)",
            transition: "opacity 0.9s ease-out 0.4s, transform 0.9s ease-out 0.4s",
          }}
        >
          <canvas
            ref={canvasRef}
            aria-hidden="true"
            style={{
              width: "100%",
              maxWidth: "500px",
              aspectRatio: "1 / 1",
              display: "block",
            }}
          />
        </div>
      </div>
    </section>
  );
}
