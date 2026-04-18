import type { Salon, Locale } from "@/types";
import { getLocalizedField } from "@/types";

const BASE_URL = "https://siamluxe.com";

export function getOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "RealEstateAgent",
    name: "SiamLuxe",
    description:
      "Premium marketplace for beauty salons for sale in Bangkok, Thailand.",
    url: BASE_URL,
    logo: `${BASE_URL}/images/logo.png`,
    areaServed: {
      "@type": "City",
      name: "Bangkok",
      addressCountry: "TH",
    },
    contactPoint: [
      {
        "@type": "ContactPoint",
        contactType: "sales",
        email: "contact@siamluxe.com",
        availableLanguage: ["French", "English", "Russian"],
      },
    ],
    sameAs: [],
  };
}

export function getSalonJsonLd(salon: Salon, locale: Locale) {
  const title = getLocalizedField(salon, "title", locale);
  const description = getLocalizedField(salon, "description", locale);
  const photo = salon.photos?.[0]?.url;

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: title,
    description: description.slice(0, 300),
    image: photo,
    url: `${BASE_URL}/${locale}/salons/${salon.slug}`,
    offers: {
      "@type": "Offer",
      price: salon.price_usd,
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
      seller: {
        "@type": "Organization",
        name: "SiamLuxe",
      },
    },
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Surface",
        value: `${salon.surface_sqm} m²`,
      },
      {
        "@type": "PropertyValue",
        name: "District",
        value: salon.district,
      },
      {
        "@type": "PropertyValue",
        name: "Rooms",
        value: salon.rooms_count,
      },
      {
        "@type": "PropertyValue",
        name: "MonthlyRevenueUSD",
        value: salon.monthly_revenue_usd,
      },
    ],
  };
}

export function getSalonsListJsonLd(salons: Salon[], locale: Locale) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Beauty Salons for Sale in Bangkok",
    numberOfItems: salons.length,
    itemListElement: salons.map((salon, index) => ({
      "@type": "ListItem",
      position: index + 1,
      url: `${BASE_URL}/${locale}/salons/${salon.slug}`,
      name: getLocalizedField(salon, "title", locale),
    })),
  };
}
