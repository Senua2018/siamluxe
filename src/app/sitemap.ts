import type { MetadataRoute } from "next";
import { DEMO_SALONS } from "@/lib/demo-data";
import { routing } from "@/i18n/routing";

const BASE_URL = "https://siamluxe.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const locales = routing.locales;

  // Static pages
  const staticPages = ["", "/salons", "/about", "/contact"];
  const staticEntries = locales.flatMap((locale) =>
    staticPages.map((page) => ({
      url: `${BASE_URL}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === "" ? ("weekly" as const) : ("monthly" as const),
      priority: page === "" ? 1.0 : page === "/salons" ? 0.9 : 0.7,
    })),
  );

  // Dynamic salon pages
  const salonEntries = locales.flatMap((locale) =>
    DEMO_SALONS.filter((s) => s.status === "published").map((salon) => ({
      url: `${BASE_URL}/${locale}/salons/${salon.slug}`,
      lastModified: new Date(salon.updated_at),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    })),
  );

  return [...staticEntries, ...salonEntries];
}
