import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";
import { SalonGrid } from "@/components/salons/SalonGrid";
import { getSalonsListJsonLd } from "@/lib/structured-data";
import { createClient } from "@/lib/supabase/server";
import type { Locale, Salon } from "@/types";

interface PageProps {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "featured" });

  return {
    title: `${t("title")} — SiamLuxe`,
    description: t("subtitle"),
    alternates: {
      canonical: `/${locale}/salons`,
      languages: { fr: "/fr/salons", en: "/en/salons", ru: "/ru/salons" },
    },
  };
}

export default async function SalonsPage({ params }: PageProps) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "featured" });

  const supabase = await createClient();
  const { data } = await supabase
    .from("salons")
    .select("*, photos:salon_photos(id, url, position, storage_path, salon_id, created_at)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  const publishedSalons = (data ?? []) as Salon[];

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(
            getSalonsListJsonLd(publishedSalons, locale as Locale),
          ),
        }}
      />
      <div className="pt-28 pb-10 sm:pt-32 sm:pb-12 bg-brown-deep text-center">
        <h1 className="font-[var(--font-playfair)] text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
          {t("title")}
        </h1>
        <div className="mx-auto h-px w-16 bg-gradient-to-r from-transparent via-gold-light/60 to-transparent mb-4" />
        <p className="font-[var(--font-cormorant)] text-base sm:text-lg text-white/60 max-w-xl mx-auto px-5">
          {t("subtitle")}
        </p>
      </div>
      <SalonGrid salons={publishedSalons} />
    </>
  );
}
