"use client";

import Image from "next/image";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import { MapPin, Heart } from "lucide-react";
import { motion } from "framer-motion";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import { calcRoiPercent } from "@/lib/utils";
import { getLocalizedField } from "@/types";
import type { Locale, Salon } from "@/types";
import { useFavorites } from "@/hooks/useFavorites";

interface SalonCardProps {
  salon: Salon;
}

export function SalonCard({ salon }: SalonCardProps) {
  const locale = useLocale() as Locale;
  const t = useTranslations("salon");
  const catT = useTranslations("categories");
  const { format } = useCurrency();
  const { isFavorite, toggleFavorite } = useFavorites();

  const title = getLocalizedField(salon, "title", locale);
  const mainPhoto = salon.photos?.[0]?.url;
  const liked = isFavorite(salon.id);
  const roi = calcRoiPercent(salon.monthly_revenue_usd, salon.price_usd);

  return (
    <Link href={`/salons/${salon.slug}`} className="group block">
      <article className="relative bg-white-soft rounded-xl overflow-hidden shadow-warm transition-all duration-500 hover:shadow-warm-lg hover:-translate-y-1">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          {mainPhoto ? (
            <Image
              src={mainPhoto}
              alt={title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full bg-cream flex items-center justify-center">
              <span className="text-text-secondary/40 font-[var(--font-montserrat)] text-xs">
                {t("noPhoto")}
              </span>
            </div>
          )}

          <div className="absolute inset-0 bg-gradient-to-t from-black-rich/50 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />

          {salon.featured && (
            <div className="absolute top-3 left-3 px-3 py-1 bg-gold/90 backdrop-blur-sm rounded-full">
              <span className="font-[var(--font-montserrat)] text-[10px] font-bold tracking-wider uppercase text-white">
                {t("featured")}
              </span>
            </div>
          )}

          {roi > 0 && (
            <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-full">
              <span className="font-[var(--font-montserrat)] text-[10px] font-bold tracking-wider text-gold-dark">
                ROI ~{roi}% / {t("perYearShort")}
              </span>
            </div>
          )}

          <motion.button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              toggleFavorite(salon.id);
            }}
            whileTap={{ scale: 0.85 }}
            className={`absolute top-3 right-3 w-9 h-9 flex items-center justify-center rounded-full transition-all duration-300 ${
              liked
                ? "bg-red-50 hover:bg-red-100"
                : "bg-white/80 backdrop-blur-sm hover:bg-white hover:scale-110"
            }`}
            aria-label={liked ? t("removeFavorite") : t("addFavorite")}
          >
            <Heart
              className={`w-4 h-4 transition-colors duration-300 ${
                liked ? "text-red-500 fill-red-500" : "text-text-secondary"
              }`}
            />
          </motion.button>

          <div className="absolute bottom-3 left-3">
            <span className="font-[var(--font-montserrat)] text-xl font-bold text-white drop-shadow-lg">
              {format(salon.price_usd)}
            </span>
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          {/* Title + location (fixed heights for visual consistency) */}
          <div className="flex flex-wrap gap-1.5 mb-3">
            {salon.categories.slice(0, 3).map((cat) => (
              <span
                key={cat}
                className="px-2.5 py-0.5 bg-gold/10 text-gold-dark font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase rounded-full border border-gold/15"
              >
                {catT(cat as "massage" | "spa" | "nails" | "hair" | "sauna" | "multi")}
              </span>
            ))}
          </div>

          <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary leading-snug mb-1 group-hover:text-gold-dark transition-colors duration-300 line-clamp-1">
            {title}
          </h3>
          <div className="flex items-center gap-1.5 text-text-secondary mb-4">
            <MapPin className="w-3.5 h-3.5 text-gold/70 shrink-0" />
            <span className="font-[var(--font-montserrat)] text-xs font-medium">
              {salon.district}
            </span>
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-3 gap-2">
            <Stat label={t("monthlyRevenueShort")} value={format(salon.monthly_revenue_usd)} />
            <Stat label={t("surfaceShort")} value={`${salon.surface_sqm} m²`} />
            <Stat label={t("roomsShort")} value={String(salon.rooms_count)} />
          </div>
        </div>
      </article>
    </Link>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="bg-cream/70 rounded-lg px-2.5 py-2 text-center">
      <div className="font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase text-text-secondary mb-0.5">
        {label}
      </div>
      <div className="font-[var(--font-montserrat)] text-xs font-bold text-text-primary truncate">
        {value}
      </div>
    </div>
  );
}
