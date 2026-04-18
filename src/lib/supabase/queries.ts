import type { Salon, SalonPhoto, Testimonial } from "@/types";

type SupabaseClient = {
  from: (table: string) => {
    select: (columns?: string) => {
      eq: (column: string, value: string | boolean) => ReturnType<ReturnType<typeof Object>["select"]>;
      order: (column: string, options?: { ascending?: boolean }) => ReturnType<ReturnType<typeof Object>["select"]>;
      limit: (count: number) => ReturnType<ReturnType<typeof Object>["select"]>;
      single: () => Promise<{ data: Record<string, unknown> | null; error: unknown }>;
      then: (fn: (result: { data: unknown[]; error: unknown }) => void) => void;
    } & Promise<{ data: unknown[]; error: unknown }>;
  };
};

export async function getPublishedSalons(supabase: ReturnType<typeof import("@supabase/ssr").createServerClient>) {
  const { data: salons, error } = await supabase
    .from("salons")
    .select("*, salon_photos(*)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching salons:", error);
    return [];
  }

  return (salons ?? []) as (Salon & { salon_photos: SalonPhoto[] })[];
}

export async function getFeaturedSalons(supabase: ReturnType<typeof import("@supabase/ssr").createServerClient>) {
  const { data: salons, error } = await supabase
    .from("salons")
    .select("*, salon_photos(*)")
    .eq("status", "published")
    .eq("featured", true)
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error("Error fetching featured salons:", error);
    return [];
  }

  return (salons ?? []) as (Salon & { salon_photos: SalonPhoto[] })[];
}

export async function getSalonBySlug(supabase: ReturnType<typeof import("@supabase/ssr").createServerClient>, slug: string) {
  const { data: salon, error } = await supabase
    .from("salons")
    .select("*, salon_photos(*)")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (error) {
    return null;
  }

  return salon as Salon & { salon_photos: SalonPhoto[] };
}

export async function getTestimonials(supabase: ReturnType<typeof import("@supabase/ssr").createServerClient>) {
  const { data, error } = await supabase
    .from("testimonials")
    .select("*")
    .eq("visible", true)
    .order("position", { ascending: true });

  if (error) {
    console.error("Error fetching testimonials:", error);
    return [];
  }

  return (data ?? []) as Testimonial[];
}

export async function getAllSalons(
  supabase: ReturnType<typeof import("@supabase/ssr").createServerClient>,
  filters?: {
    category?: string;
    district?: string;
    sortBy?: string;
  }
) {
  let query = supabase
    .from("salons")
    .select("*, salon_photos(*)")
    .eq("status", "published");

  if (filters?.district) {
    query = query.eq("district", filters.district);
  }

  if (filters?.category) {
    query = query.contains("categories", [filters.category]);
  }

  switch (filters?.sortBy) {
    case "price_asc":
      query = query.order("price_usd", { ascending: true });
      break;
    case "price_desc":
      query = query.order("price_usd", { ascending: false });
      break;
    default:
      query = query.order("created_at", { ascending: false });
  }

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching salons:", error);
    return [];
  }

  return (data ?? []) as (Salon & { salon_photos: SalonPhoto[] })[];
}
