"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/navigation";
import {
  MapPin,
  Maximize2,
  Tag,
  ArrowLeft,
  DoorOpen,
  TrendingUp,
  Percent,
} from "lucide-react";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import { calcRoiPercent } from "@/lib/utils";
import { getLocalizedField } from "@/types";
import type { Locale, Salon } from "@/types";
import { PhotoGallery } from "@/components/salons/PhotoGallery";
import { ContactSidebar } from "@/components/salons/ContactSidebar";
import { AmenityList } from "@/components/salons/AmenityList";
import { SalonCard } from "@/components/salons/SalonCard";

interface Props {
  salon: Salon;
  locale: Locale;
  similar: Salon[];
}

export function SalonDetailClient({ salon, locale, similar }: Props) {
  const t = useTranslations("salon");
  const catT = useTranslations("categories");
  const { format } = useCurrency();

  const title = getLocalizedField(salon, "title", locale);
  const description = getLocalizedField(salon, "description", locale);
  const roi = calcRoiPercent(salon.monthly_revenue_usd, salon.price_usd);


  return (
    <div className="pb-24 lg:pb-12">
      {/* Breadcrumb */}
      <div className="pt-24 sm:pt-28 pb-4 bg-cream">
        <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
          <Link
            href="/salons"
            className="inline-flex items-center gap-1.5 font-[var(--font-montserrat)] text-xs font-medium text-text-secondary hover:text-gold-dark transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            {t("backToListings")}
          </Link>
        </div>
      </div>

      {/* Main content */}
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12">
        <div className="lg:grid lg:grid-cols-[1fr_320px] lg:gap-8">
          {/* Left column */}
          <div>
            <PhotoGallery photos={salon.photos ?? []} title={title} />

            {/* Title + meta */}
            <div className="mt-6 sm:mt-8">
              <div className="flex flex-wrap gap-1.5 mb-3">
                {salon.categories.map((cat) => (
                  <span
                    key={cat}
                    className="px-3 py-1 bg-gold/10 text-gold-dark font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase rounded-full border border-gold/15"
                  >
                    {catT(cat as "massage" | "spa" | "nails" | "hair" | "sauna" | "multi")}
                  </span>
                ))}
              </div>

              <h1 className="font-[var(--font-playfair)] text-2xl sm:text-3xl lg:text-4xl font-bold text-text-primary leading-snug">
                {title}
              </h1>

              <div className="w-16 h-px bg-gradient-to-r from-gold/60 to-transparent my-5" />

              {/* Price + quick info */}
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8">
                <div className="flex items-center gap-2">
                  <Tag className="w-4 h-4 text-gold" />
                  <span className="font-[var(--font-montserrat)] text-xl font-bold text-gold-dark">
                    {format(salon.price_usd)}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-gold/70" />
                  <span className="font-[var(--font-montserrat)] text-sm font-medium text-text-primary">
                    {salon.district}
                  </span>
                </div>
              </div>

              {/* Key metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-10">
                <MetricCard
                  icon={<Maximize2 className="w-4 h-4" />}
                  label={t("surface")}
                  value={`${salon.surface_sqm} m²`}
                />
                <MetricCard
                  icon={<DoorOpen className="w-4 h-4" />}
                  label={t("rooms")}
                  value={String(salon.rooms_count)}
                />
                <MetricCard
                  icon={<TrendingUp className="w-4 h-4" />}
                  label={t("monthlyRevenue")}
                  value={format(salon.monthly_revenue_usd)}
                />
                <MetricCard
                  icon={<Percent className="w-4 h-4" />}
                  label={t("estimatedRoi")}
                  value={roi > 0 ? `~${roi}% / ${t("perYearShort")}` : "—"}
                />
              </div>

              {/* Description */}
              <div className="mb-10">
                <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-3">
                  {t("description")}
                </h3>
                <p className="font-[var(--font-cormorant)] text-base text-text-secondary leading-relaxed whitespace-pre-line">
                  {description}
                </p>
              </div>

              {/* Amenities */}
              {salon.amenities.length > 0 && (
                <div className="mb-10">
                  <AmenityList amenities={salon.amenities} locale={locale} />
                </div>
              )}

              {/* Location */}
              <div className="mb-10">
                <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-4">
                  {t("location")}
                </h3>
                <div className="rounded-xl overflow-hidden border border-gold/10 shadow-warm">
                  <iframe
                    src={`https://www.google.com/maps/embed/v1/place?key=AIzaSyBFw0Qbyq9zTFTd-tUY6dZWTgaQzuU17R8&q=${salon.latitude},${salon.longitude}&zoom=15`}
                    width="100%"
                    height="300"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Map — ${title}`}
                  />
                </div>
                <p className="mt-2 font-[var(--font-montserrat)] text-xs text-text-secondary">
                  {salon.address}
                </p>
              </div>
            </div>
          </div>

          <ContactSidebar
            whatsapp={salon.contact_whatsapp}
            line={salon.contact_line}
            email={salon.contact_email}
            salonTitle={title}
          />
        </div>

        {similar.length > 0 && (
          <div className="mt-16 pt-12 border-t border-gold/10">
            <h2 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary mb-2">
              {t("similar")}
            </h2>
            <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent mb-8" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {similar.map((s) => (
                <SalonCard key={s.id} salon={s} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function MetricCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white-soft rounded-xl border border-gold/10 p-4">
      <div className="flex items-center gap-2 text-gold-dark mb-2">
        {icon}
        <span className="font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase">
          {label}
        </span>
      </div>
      <div className="font-[var(--font-montserrat)] text-sm font-bold text-text-primary">
        {value}
      </div>
    </div>
  );
}
