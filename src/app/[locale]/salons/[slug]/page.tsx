import { notFound } from "next/navigation";
import { getTranslations } from "next-intl/server";
import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getLocalizedField } from "@/types";
import type { Locale, Salon } from "@/types";
import { SalonDetailClient } from "./SalonDetailClient";
import { getSalonJsonLd } from "@/lib/structured-data";

const BASE_URL = "https://siamluxe.com";

interface Props {
  params: Promise<{ locale: string; slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from("salons")
    .select("*, photos:salon_photos(id, url, position, storage_path, salon_id, created_at)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) return { title: "Not Found" };
  const salon = data as Salon;
  const title = getLocalizedField(salon, "title", locale as Locale);
  const description = getLocalizedField(salon, "description", locale as Locale).slice(0, 160);
  const photo = salon.photos?.[0]?.url;

  return {
    title: `${title} — SiamLuxe`,
    description,
    alternates: {
      canonical: `/${locale}/salons/${slug}`,
      languages: {
        fr: `/fr/salons/${slug}`,
        en: `/en/salons/${slug}`,
        ru: `/ru/salons/${slug}`,
      },
    },
    openGraph: {
      title: `${title} — SiamLuxe`,
      description,
      url: `${BASE_URL}/${locale}/salons/${slug}`,
      siteName: "SiamLuxe",
      type: "article",
      images: photo ? [{ url: photo, width: 800, height: 600, alt: title }] : [],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} — SiamLuxe`,
      description,
      images: photo ? [photo] : [],
    },
  };
}

export default async function SalonDetailPage({ params }: Props) {
  const { locale, slug } = await params;
  const supabase = await createClient();

  const { data } = await supabase
    .from("salons")
    .select("*, photos:salon_photos(id, url, position, storage_path, salon_id, created_at)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (!data) notFound();
  const salon = data as Salon;

  const { data: allSalons } = await supabase
    .from("salons")
    .select("*, photos:salon_photos(id, url, position, storage_path, salon_id, created_at)")
    .eq("status", "published")
    .neq("id", salon.id);

  const similar = ((allSalons ?? []) as Salon[])
    .filter((s) => s.categories.some((c) => salon.categories.includes(c)))
    .slice(0, 3);

  await getTranslations({ locale, namespace: "salon" });

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(getSalonJsonLd(salon, locale as Locale)),
        }}
      />
      <SalonDetailClient
        salon={salon}
        locale={locale as Locale}
        similar={similar}
      />
    </>
  );
}
