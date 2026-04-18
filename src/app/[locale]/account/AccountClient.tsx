"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";
import { Link } from "@/i18n/navigation";
import { SalonCard } from "@/components/salons/SalonCard";
import { Save, LogOut, Heart, UserCircle, Loader2 } from "lucide-react";
import type { Salon, SalonPhoto } from "@/types";

interface Props {
  user: User;
  profile: {
    full_name: string | null;
    phone: string | null;
    preferred_language: string | null;
    nationality: string | null;
  } | null;
  favorites: {
    salon_id: string;
    salons: Salon & { salon_photos: SalonPhoto[] };
  }[];
  locale: string;
}

export function AccountClient({ user, profile, favorites, locale }: Props) {
  const router = useRouter();
  const [tab, setTab] = useState<"profile" | "favorites">("profile");
  const [saving, setSaving] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? "");
  const [phone, setPhone] = useState(profile?.phone ?? "");
  const [nationality, setNationality] = useState(profile?.nationality ?? "");
  const [preferredLang, setPreferredLang] = useState(profile?.preferred_language ?? locale);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const supabase = createClient();

    await supabase
      .from("profiles")
      .update({
        full_name: fullName,
        phone,
        nationality,
        preferred_language: preferredLang,
      })
      .eq("id", user.id);

    setSaving(false);
    router.refresh();
  }

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push(`/${locale}`);
    router.refresh();
  }

  const inputClass =
    "w-full px-4 py-2.5 rounded-lg border border-gold/15 bg-cream/30 font-[var(--font-montserrat)] text-sm text-text-primary placeholder:text-text-secondary/40 focus:outline-none focus:border-gold/40 focus:ring-1 focus:ring-gold/20 transition-all";

  // Map favorites to salon objects with photos
  const favoriteSalons = favorites
    .map((f) => {
      const salon = f.salons;
      if (!salon) return null;
      return {
        ...salon,
        photos: salon.salon_photos ?? [],
      } as Salon;
    })
    .filter(Boolean) as Salon[];

  return (
    <div className="min-h-screen bg-cream pt-28 pb-16">
      <div className="mx-auto max-w-4xl px-5 sm:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="font-[var(--font-playfair)] text-2xl sm:text-3xl font-bold text-text-primary">
              Mon compte
            </h1>
            <p className="font-[var(--font-montserrat)] text-xs text-text-secondary mt-1">
              {user.email}
            </p>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-4 py-2 rounded-full border border-red-200 text-red-600 font-[var(--font-montserrat)] text-xs font-medium hover:bg-red-50 transition-colors"
          >
            <LogOut className="w-3.5 h-3.5" />
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex bg-white-soft rounded-full p-1 mb-8 border border-gold/10 max-w-xs">
          <button
            onClick={() => setTab("profile")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-[var(--font-montserrat)] text-xs font-semibold transition-all ${
              tab === "profile" ? "bg-gold text-white" : "text-text-secondary"
            }`}
          >
            <UserCircle className="w-3.5 h-3.5" />
            Profil
          </button>
          <button
            onClick={() => setTab("favorites")}
            className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-full font-[var(--font-montserrat)] text-xs font-semibold transition-all ${
              tab === "favorites" ? "bg-gold text-white" : "text-text-secondary"
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            Favoris ({favoriteSalons.length})
          </button>
        </div>

        {/* Profile Tab */}
        {tab === "profile" && (
          <div className="bg-white-soft rounded-xl border border-gold/10 shadow-warm p-6 sm:p-8">
            <form onSubmit={handleSaveProfile} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                    Nom complet
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className={inputClass}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                    Téléphone
                  </label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className={inputClass}
                    placeholder="+66 812 345 678"
                  />
                </div>
                <div>
                  <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                    Nationalité
                  </label>
                  <input
                    type="text"
                    value={nationality}
                    onChange={(e) => setNationality(e.target.value)}
                    className={inputClass}
                    placeholder="Française"
                  />
                </div>
                <div>
                  <label className="block font-[var(--font-montserrat)] text-xs font-medium text-text-secondary mb-1.5">
                    Langue préférée
                  </label>
                  <select
                    value={preferredLang}
                    onChange={(e) => setPreferredLang(e.target.value)}
                    className={inputClass}
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ru">Русский</option>
                  </select>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-xs font-semibold tracking-wide hover:bg-gold-dark hover:shadow-warm disabled:opacity-50 transition-all"
                >
                  {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
                  {saving ? "Enregistrement..." : "Enregistrer"}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Favorites Tab */}
        {tab === "favorites" && (
          <div>
            {favoriteSalons.length === 0 ? (
              <div className="text-center py-16 bg-white-soft rounded-xl border border-gold/10">
                <Heart className="w-10 h-10 text-gold/20 mx-auto mb-4" />
                <p className="font-[var(--font-cormorant)] text-lg text-text-secondary mb-4">
                  Vous n&apos;avez pas encore de favoris.
                </p>
                <Link
                  href="/salons"
                  className="inline-block font-[var(--font-montserrat)] text-sm font-semibold text-gold-dark hover:text-gold transition-colors"
                >
                  Découvrir les salons
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {favoriteSalons.map((salon) => (
                  <SalonCard key={salon.id} salon={salon} />
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
