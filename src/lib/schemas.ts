import { z } from "zod";

export const salonSchema = z.object({
  title_fr: z.string().min(3, "Le titre français est requis (min. 3 caractères)"),
  title_en: z.string().default(""),
  title_ru: z.string().default(""),
  description_fr: z.string().min(10, "La description française est requise (min. 10 caractères)"),
  description_en: z.string().default(""),
  description_ru: z.string().default(""),
  price_usd: z.coerce.number().positive("Le prix USD doit être positif"),
  price_thb: z.coerce.number().nonnegative().default(0),
  price_eur: z.coerce.number().nonnegative().default(0),
  monthly_revenue_usd: z.coerce.number().nonnegative().default(0),
  rooms_count: z.coerce.number().int().nonnegative().default(0),
  surface_sqm: z.coerce.number().positive("La surface doit être positive"),
  district: z.string().min(1, "Le quartier est requis"),
  address: z.string().default(""),
  latitude: z.coerce.number().optional(),
  longitude: z.coerce.number().optional(),
  categories: z.array(z.string()).min(1, "Sélectionnez au moins une catégorie"),
  amenities: z.array(z.string()).default([]),
  contact_whatsapp: z.string().default(""),
  contact_line: z.string().default(""),
  contact_email: z.string().default(""),
  video_url: z.string().default(""),
  status: z.enum(["draft", "published"]).default("draft"),
  featured: z.boolean().default(false),
});

export type SalonFormData = z.infer<typeof salonSchema>;
