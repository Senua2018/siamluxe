"use client";

import Image from "next/image";
import { Link } from "@/i18n/navigation";
import {
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  MessageSquare,
  Building2,
} from "lucide-react";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface SalonRow {
  id: string;
  slug: string;
  title_fr: string;
  status: string;
  price_usd: number;
  district: string;
  featured: boolean;
  created_at: string;
  salon_photos: { id: string; url: string; position: number }[];
}

interface Props {
  salons: SalonRow[];
  contactCount: number;
  locale: string;
}

export function AdminDashboardClient({ salons, contactCount, locale }: Props) {
  const router = useRouter();
  const { format } = useCurrency();
  const [deleting, setDeleting] = useState<string | null>(null);

  const published = salons.filter((s) => s.status === "published").length;
  const drafts = salons.filter((s) => s.status === "draft").length;

  async function handleDelete(id: string) {
    if (!confirm("Supprimer cette annonce ? Cette action est irréversible.")) return;
    setDeleting(id);
    const supabase = createClient();
    await supabase.from("salons").delete().eq("id", id);
    router.refresh();
    setDeleting(null);
  }

  async function toggleStatus(id: string, current: string) {
    const supabase = createClient();
    await supabase
      .from("salons")
      .update({ status: current === "published" ? "draft" : "published" })
      .eq("id", id);
    router.refresh();
  }

  async function toggleFeatured(id: string, current: boolean) {
    const supabase = createClient();
    await supabase
      .from("salons")
      .update({ featured: !current })
      .eq("id", id);
    router.refresh();
  }

  return (
    <div className="pt-14">
      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={<Building2 className="w-5 h-5 text-gold-dark" />}
          value={salons.length}
          label="Total salons"
        />
        <StatCard
          icon={<Eye className="w-5 h-5 text-green-600" />}
          value={published}
          label="Publiés"
        />
        <StatCard
          icon={<EyeOff className="w-5 h-5 text-amber-600" />}
          value={drafts}
          label="Brouillons"
        />
        <StatCard
          icon={<MessageSquare className="w-5 h-5 text-blue-600" />}
          value={contactCount}
          label="Demandes contact"
        />
      </div>

      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
          Gestion des salons
        </h1>
        <Link
          href="/admin/salons/new"
          className="flex items-center gap-2 px-5 py-2.5 rounded-full bg-gold text-white font-[var(--font-montserrat)] text-xs font-semibold tracking-wide transition-all hover:bg-gold-dark hover:shadow-warm"
        >
          <Plus className="w-4 h-4" />
          Nouveau salon
        </Link>
      </div>

      {/* Salons table */}
      {salons.length === 0 ? (
        <div className="text-center py-16 bg-white-soft rounded-xl border border-gold/10">
          <Building2 className="w-10 h-10 text-gold/30 mx-auto mb-4" />
          <p className="font-[var(--font-cormorant)] text-lg text-text-secondary">
            Aucune annonce pour le moment.
          </p>
          <Link
            href="/admin/salons/new"
            className="inline-flex items-center gap-1.5 mt-4 font-[var(--font-montserrat)] text-sm font-semibold text-gold-dark hover:text-gold transition-colors"
          >
            <Plus className="w-4 h-4" />
            Créer votre première annonce
          </Link>
        </div>
      ) : (
        <div className="bg-white-soft rounded-xl border border-gold/10 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gold/10 bg-cream/50">
                  <th className="text-left px-4 py-3 font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase text-text-secondary">
                    Salon
                  </th>
                  <th className="text-left px-4 py-3 font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase text-text-secondary hidden sm:table-cell">
                    Quartier
                  </th>
                  <th className="text-left px-4 py-3 font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase text-text-secondary hidden md:table-cell">
                    Prix
                  </th>
                  <th className="text-left px-4 py-3 font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase text-text-secondary">
                    Statut
                  </th>
                  <th className="text-right px-4 py-3 font-[var(--font-montserrat)] text-[10px] font-semibold tracking-wider uppercase text-text-secondary">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {salons.map((salon) => {
                  const photo = salon.salon_photos
                    ?.sort((a, b) => a.position - b.position)[0]?.url;

                  return (
                    <tr
                      key={salon.id}
                      className="border-b border-gold/5 hover:bg-cream/30 transition-colors"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <div className="relative w-12 h-9 rounded-md overflow-hidden flex-shrink-0 bg-cream">
                            {photo && (
                              <Image
                                src={photo}
                                alt={salon.title_fr}
                                fill
                                className="object-cover"
                                sizes="48px"
                              />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-[var(--font-montserrat)] text-sm font-medium text-text-primary truncate max-w-[200px]">
                              {salon.title_fr}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 hidden sm:table-cell">
                        <span className="font-[var(--font-montserrat)] text-xs text-text-secondary">
                          {salon.district}
                        </span>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell">
                        <span className="font-[var(--font-montserrat)] text-xs font-medium text-text-primary">
                          {format(salon.price_usd)}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <span
                            className={`inline-flex px-2 py-0.5 rounded-full font-[var(--font-montserrat)] text-[10px] font-semibold ${
                              salon.status === "published"
                                ? "bg-green-50 text-green-700 border border-green-200"
                                : "bg-amber-50 text-amber-700 border border-amber-200"
                            }`}
                          >
                            {salon.status === "published" ? "Publié" : "Brouillon"}
                          </span>
                          {salon.featured && (
                            <Star className="w-3.5 h-3.5 text-gold fill-gold" />
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center justify-end gap-1">
                          <button
                            onClick={() => toggleStatus(salon.id, salon.status)}
                            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                            title={salon.status === "published" ? "Dépublier" : "Publier"}
                          >
                            {salon.status === "published" ? (
                              <EyeOff className="w-3.5 h-3.5 text-text-secondary" />
                            ) : (
                              <Eye className="w-3.5 h-3.5 text-green-600" />
                            )}
                          </button>
                          <button
                            onClick={() => toggleFeatured(salon.id, salon.featured)}
                            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                            title={salon.featured ? "Retirer vedette" : "Mettre en vedette"}
                          >
                            <Star
                              className={`w-3.5 h-3.5 ${
                                salon.featured
                                  ? "text-gold fill-gold"
                                  : "text-text-secondary/40"
                              }`}
                            />
                          </button>
                          <Link
                            href={`/admin/salons/${salon.id}/edit`}
                            className="p-1.5 rounded-lg hover:bg-cream transition-colors"
                            title="Modifier"
                          >
                            <Edit className="w-3.5 h-3.5 text-text-secondary" />
                          </Link>
                          <button
                            onClick={() => handleDelete(salon.id)}
                            disabled={deleting === salon.id}
                            className="p-1.5 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
                            title="Supprimer"
                          >
                            <Trash2 className="w-3.5 h-3.5 text-red-500/70" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  icon,
  value,
  label,
}: {
  icon: React.ReactNode;
  value: number;
  label: string;
}) {
  return (
    <div className="bg-white-soft rounded-xl border border-gold/10 p-5">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gold/8">
          {icon}
        </div>
        <div>
          <p className="font-[var(--font-playfair)] text-2xl font-bold text-text-primary">
            {value}
          </p>
          <p className="font-[var(--font-montserrat)] text-[10px] font-medium tracking-wider uppercase text-text-secondary">
            {label}
          </p>
        </div>
      </div>
    </div>
  );
}
