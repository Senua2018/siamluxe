export type Locale = "fr" | "en" | "ru";

export type Currency = "USD" | "EUR" | "THB";

export interface Salon {
  id: string;
  slug: string;
  status: "draft" | "published";
  price_usd: number;
  price_thb: number;
  price_eur: number;
  monthly_revenue_usd: number;
  rooms_count: number;
  surface_sqm: number;
  district: string;
  address: string;
  latitude: number;
  longitude: number;
  title_fr: string;
  title_en: string;
  title_ru: string;
  description_fr: string;
  description_en: string;
  description_ru: string;
  categories: string[];
  amenities: string[];
  contact_whatsapp: string;
  contact_line: string;
  contact_email: string;
  video_url: string | null;
  featured: boolean;
  created_by: string;
  created_at: string;
  updated_at: string;
  photos?: SalonPhoto[];
}

export interface SalonPhoto {
  id: string;
  salon_id: string;
  storage_path: string;
  url: string;
  position: number;
  created_at: string;
}

export interface Testimonial {
  id: string;
  author_name: string;
  author_nationality: string;
  author_avatar_url: string;
  quote_fr: string;
  quote_en: string;
  quote_ru: string;
  rating: number;
  position: number;
  visible: boolean;
  created_at: string;
}

export interface Profile {
  id: string;
  full_name: string;
  phone: string;
  preferred_language: Locale;
  nationality: string;
  role: "visitor" | "admin";
  avatar_url: string;
  created_at: string;
  updated_at: string;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getLocalizedField(
  item: any,
  field: string,
  locale: Locale,
): string {
  const key = `${field}_${locale}`;
  const fallback = `${field}_fr`;
  return (item[key] as string) || (item[fallback] as string) || "";
}
