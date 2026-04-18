"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useLocale } from "next-intl";
import { Save, Loader2 } from "lucide-react";
import { salonSchema, type SalonFormData } from "@/lib/schemas";
import { CATEGORIES, DISTRICTS, AMENITIES } from "@/lib/constants";
import { slugify } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";
import { PhotoUploader, type PhotoItem } from "./PhotoUploader";

const AMENITY_LABELS: Record<string, string> = {
  aircon: "Climatisation",
  wifi: "Wi-Fi",
  parking: "Parking",
  equipment_included: "Équipement inclus",
  staff_included: "Personnel inclus",
  training_included: "Formation incluse",
  private_rooms: "Salles privées",
  shower: "Douche",
  reception: "Réception",
  storage: "Stockage",
};

const CAT_LABELS: Record<string, string> = {
  massage: "Massage",
  spa: "SPA",
  nails: "Ongles",
  hair: "Coiffure",
  sauna: "Sauna",
  multi: "Multi-services",
};

interface SalonFormProps {
  initialData?: SalonFormData & { id?: string };
  initialPhotos?: PhotoItem[];
}

export function SalonForm({ initialData, initialPhotos = [] }: SalonFormProps) {
  const locale = useLocale();
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
  const [error, setError] = useState("");

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SalonFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(salonSchema) as any,
    defaultValues: initialData ?? {
      title_fr: "",
      title_en: "",
      title_ru: "",
      description_fr: "",
      description_en: "",
      description_ru: "",
      price_usd: 0,
      price_thb: 0,
      price_eur: 0,
      monthly_revenue_usd: 0,
      rooms_count: 0,
      surface_sqm: 0,
      district: "",
      address: "",
      latitude: 13.7563,
      longitude: 100.5018,
      categories: [],
      amenities: [],
      contact_whatsapp: "",
      contact_line: "",
      contact_email: "",
      video_url: "",
      status: "draft",
      featured: false,
    },
  });

  const selectedCategories = watch("categories");
  const selectedAmenities = watch("amenities");

  function toggleArrayValue(field: "categories" | "amenities", value: string) {
    const current = field === "categories" ? selectedCategories : selectedAmenities;
    const next = current.includes(value)
      ? current.filter((v) => v !== value)
      : [...current, value];
    setValue(field, next, { shouldValidate: true });
  }

  async function onSubmit(data: SalonFormData) {
    setSaving(true);
    setError("");

    try {
      const supabase = createClient();
      const slug = slugify(data.title_fr);
      const isEdit = !!initialData?.id;

      // Save or update salon
      let salonId = initialData?.id;

      if (isEdit && salonId) {
        const { error } = await supabase
          .from("salons")
          .update({ ...data, slug })
          .eq("id", salonId);

        if (error) throw error;
      } else {
        const { data: newSalon, error } = await supabase
          .from("salons")
          .insert({ ...data, slug })
          .select("id")
          .single();

        if (error) throw error;
        salonId = newSalon.id;
      }

      // Upload photos
      if (salonId) {
        // Remove old photos in DB if editing
        if (isEdit) {
          await supabase.from("salon_photos").delete().eq("salon_id", salonId);
        }

        // Upload new files and get URLs
        for (let i = 0; i < photos.length; i++) {
          const photo = photos[i];

          if (photo.file) {
            // Upload to storage
            const ext = photo.file.name.split(".").pop();
            const path = `${salonId}/${Date.now()}-${i}.${ext}`;

            const { error: uploadError } = await supabase.storage
              .from("salon-photos")
              .upload(path, photo.file, { upsert: true });

            if (!uploadError) {
              const {
                data: { publicUrl },
              } = supabase.storage.from("salon-photos").getPublicUrl(path);

              await supabase.from("salon_photos").insert({
                salon_id: salonId,
                storage_path: path,
                url: publicUrl,
                position: i,
              });
            }
          } else if (photo.storage_path) {
            // Re-insert existing photo reference
            await supabase.from("salon_photos").insert({
              salon_id: salonId,
              storage_path: photo.storage_path,
              url: photo.url,
              position: i,
            });
          }
        }
      }

      router.push(`/${locale}/admin`);
      router.refresh();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Erreur lors de la sauvegarde";
      setError(message);
      setSaving(false);
    }
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gold/15 bg-cream/30 font-[var(--font-montserrat)] text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all";
  const labelClass =
    "block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5";
  const errorClass = "font-[var(--font-montserrat)] text-[10px] text-red-500 mt-1";

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8 pt-14">
      {error && (
        <div className="p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 font-[var(--font-montserrat)] text-sm">
          {error}
        </div>
      )}

      {/* Titles */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Titres
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>
              Titre FR <span className="text-red-400">*</span>
            </label>
            <input {...register("title_fr")} className={inputClass} placeholder="Luxe Spa — Sukhumvit" />
            {errors.title_fr && <p className={errorClass}>{errors.title_fr.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Titre EN</label>
            <input {...register("title_en")} className={inputClass} placeholder="Luxe Spa — Sukhumvit" />
          </div>
          <div>
            <label className={labelClass}>Titre RU</label>
            <input {...register("title_ru")} className={inputClass} placeholder="Люкс Спа — Сукхумвит" />
          </div>
        </div>
      </section>

      {/* Descriptions */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Descriptions
        </h2>
        <div className="space-y-4">
          <div>
            <label className={labelClass}>
              Description FR <span className="text-red-400">*</span>
            </label>
            <textarea
              {...register("description_fr")}
              rows={5}
              className={inputClass + " resize-y"}
              placeholder="Décrivez le salon en détail..."
            />
            {errors.description_fr && <p className={errorClass}>{errors.description_fr.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Description EN</label>
            <textarea {...register("description_en")} rows={4} className={inputClass + " resize-y"} />
          </div>
          <div>
            <label className={labelClass}>Description RU</label>
            <textarea {...register("description_ru")} rows={4} className={inputClass + " resize-y"} />
          </div>
        </div>
      </section>

      {/* Photos */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Photos
        </h2>
        <PhotoUploader photos={photos} onChange={setPhotos} />
      </section>

      {/* Financials & Surface */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Données financières & surface
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className={labelClass}>
              Prix demandé (USD) <span className="text-red-400">*</span>
            </label>
            <input {...register("price_usd")} type="number" className={inputClass} placeholder="50000" />
            {errors.price_usd && <p className={errorClass}>{errors.price_usd.message}</p>}
          </div>
          <div>
            <label className={labelClass}>
              CA mensuel estimé (USD)
            </label>
            <input {...register("monthly_revenue_usd")} type="number" className={inputClass} placeholder="7000" />
            {errors.monthly_revenue_usd && <p className={errorClass}>{errors.monthly_revenue_usd.message}</p>}
          </div>
          <div>
            <label className={labelClass}>
              Pièces / cabines
            </label>
            <input {...register("rooms_count")} type="number" className={inputClass} placeholder="8" />
            {errors.rooms_count && <p className={errorClass}>{errors.rooms_count.message}</p>}
          </div>
          <div>
            <label className={labelClass}>
              Surface (m²) <span className="text-red-400">*</span>
            </label>
            <input {...register("surface_sqm")} type="number" className={inputClass} placeholder="100" />
            {errors.surface_sqm && <p className={errorClass}>{errors.surface_sqm.message}</p>}
          </div>
        </div>
      </section>

      {/* Location */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Localisation
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className={labelClass}>
              Quartier <span className="text-red-400">*</span>
            </label>
            <select {...register("district")} className={inputClass}>
              <option value="">Sélectionner...</option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>
            {errors.district && <p className={errorClass}>{errors.district.message}</p>}
          </div>
          <div>
            <label className={labelClass}>Adresse</label>
            <input {...register("address")} className={inputClass} placeholder="Sukhumvit Soi 24, Bangkok" />
          </div>
          <div>
            <label className={labelClass}>Latitude</label>
            <input {...register("latitude")} type="number" step="any" className={inputClass} placeholder="13.7563" />
          </div>
          <div>
            <label className={labelClass}>Longitude</label>
            <input {...register("longitude")} type="number" step="any" className={inputClass} placeholder="100.5018" />
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Catégories <span className="text-red-400">*</span>
        </h2>
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => toggleArrayValue("categories", cat)}
              className={`px-4 py-2 rounded-full font-[var(--font-montserrat)] text-xs font-medium border transition-all ${
                selectedCategories.includes(cat)
                  ? "bg-gold text-white border-gold"
                  : "bg-cream/50 text-text-secondary border-gold/15 hover:border-gold/30"
              }`}
            >
              {CAT_LABELS[cat] || cat}
            </button>
          ))}
        </div>
        {errors.categories && <p className={errorClass}>{errors.categories.message}</p>}
      </section>

      {/* Amenities */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Équipements
        </h2>
        <div className="flex flex-wrap gap-2">
          {AMENITIES.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => toggleArrayValue("amenities", a)}
              className={`px-4 py-2 rounded-full font-[var(--font-montserrat)] text-xs font-medium border transition-all ${
                selectedAmenities.includes(a)
                  ? "bg-gold text-white border-gold"
                  : "bg-cream/50 text-text-secondary border-gold/15 hover:border-gold/30"
              }`}
            >
              {AMENITY_LABELS[a] || a}
            </button>
          ))}
        </div>
      </section>

      {/* Contact */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Contact
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className={labelClass}>WhatsApp</label>
            <input {...register("contact_whatsapp")} className={inputClass} placeholder="+66812345678" />
          </div>
          <div>
            <label className={labelClass}>LINE ID</label>
            <input {...register("contact_line")} className={inputClass} placeholder="siamluxe" />
          </div>
          <div>
            <label className={labelClass}>Email</label>
            <input {...register("contact_email")} type="email" className={inputClass} placeholder="contact@salon.com" />
          </div>
        </div>
      </section>

      {/* Video */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Vidéo (optionnel)
        </h2>
        <div>
          <label className={labelClass}>URL de la vidéo</label>
          <input {...register("video_url")} className={inputClass} placeholder="https://..." />
        </div>
      </section>

      {/* Status & Featured */}
      <section className="bg-white-soft rounded-xl border border-gold/10 p-6">
        <h2 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-5">
          Publication
        </h2>
        <div className="flex flex-wrap items-center gap-6">
          <div>
            <label className={labelClass}>Statut</label>
            <select {...register("status")} className={inputClass + " w-48"}>
              <option value="draft">Brouillon</option>
              <option value="published">Publié</option>
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer mt-4">
            <input
              type="checkbox"
              {...register("featured")}
              className="w-4 h-4 rounded border-gold/30 text-gold focus:ring-gold/30"
            />
            <span className="font-[var(--font-montserrat)] text-sm font-medium text-text-primary">
              Mettre en vedette
            </span>
          </label>
        </div>
      </section>

      {/* Submit */}
      <div className="flex items-center justify-end gap-4 pb-8">
        <button
          type="button"
          onClick={() => router.back()}
          className="px-6 py-2.5 rounded-full border border-gold/20 font-[var(--font-montserrat)] text-sm font-medium text-text-secondary hover:border-gold/40 transition-colors"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={saving}
          className="flex items-center gap-2 px-8 py-2.5 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-sm font-semibold tracking-wide transition-all hover:bg-gold-dark hover:shadow-warm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {saving ? (
            <Loader2 className="w-4 h-4 animate-spin" />
          ) : (
            <Save className="w-4 h-4" />
          )}
          {saving ? "Enregistrement..." : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
