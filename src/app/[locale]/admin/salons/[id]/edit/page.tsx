import { redirect, notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { SalonForm } from "@/components/admin/SalonForm";
import type { PhotoItem } from "@/components/admin/PhotoUploader";

export default async function EditSalonPage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect(`/${locale}/admin/login`);
  }

  const { data: salon } = await supabase
    .from("salons")
    .select("*, salon_photos(*)")
    .eq("id", id)
    .single();

  if (!salon) {
    notFound();
  }

  const initialPhotos: PhotoItem[] = (salon.salon_photos ?? [])
    .sort((a: { position: number }, b: { position: number }) => a.position - b.position)
    .map((p: { id: string; url: string; storage_path: string; position: number }) => ({
      id: p.id,
      url: p.url,
      storage_path: p.storage_path,
      position: p.position,
    }));

  return (
    <div>
      <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary pt-14">
        Modifier le Salon
      </h1>
      <div className="w-12 h-px bg-gradient-to-r from-gold/50 to-transparent mt-2 mb-2" />
      <SalonForm
        initialData={{
          id: salon.id,
          title_fr: salon.title_fr ?? "",
          title_en: salon.title_en ?? "",
          title_ru: salon.title_ru ?? "",
          description_fr: salon.description_fr ?? "",
          description_en: salon.description_en ?? "",
          description_ru: salon.description_ru ?? "",
          price_usd: salon.price_usd ?? 0,
          price_thb: salon.price_thb ?? 0,
          price_eur: salon.price_eur ?? 0,
          monthly_revenue_usd: salon.monthly_revenue_usd ?? 0,
          rooms_count: salon.rooms_count ?? 0,
          surface_sqm: salon.surface_sqm ?? 0,
          district: salon.district ?? "",
          address: salon.address ?? "",
          latitude: salon.latitude ?? 13.7563,
          longitude: salon.longitude ?? 100.5018,
          categories: salon.categories ?? [],
          amenities: salon.amenities ?? [],
          contact_whatsapp: salon.contact_whatsapp ?? "",
          contact_line: salon.contact_line ?? "",
          contact_email: salon.contact_email ?? "",
          video_url: salon.video_url ?? "",
          status: salon.status ?? "draft",
          featured: salon.featured ?? false,
        }}
        initialPhotos={initialPhotos}
      />
    </div>
  );
}
