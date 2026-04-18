"use client";

import {
  AirVent,
  Wifi,
  Car,
  Wrench,
  Users,
  GraduationCap,
  DoorOpen,
  ShowerHead,
  ConciergeBell,
  Archive,
} from "lucide-react";
import { useTranslations } from "next-intl";

const AMENITY_ICONS: Record<string, typeof AirVent> = {
  aircon: AirVent,
  wifi: Wifi,
  parking: Car,
  equipment_included: Wrench,
  staff_included: Users,
  training_included: GraduationCap,
  private_rooms: DoorOpen,
  shower: ShowerHead,
  reception: ConciergeBell,
  storage: Archive,
};

const AMENITY_LABELS: Record<string, Record<string, string>> = {
  aircon: { fr: "Climatisation", en: "Air conditioning", ru: "Кондиционер" },
  wifi: { fr: "Wi-Fi", en: "Wi-Fi", ru: "Wi-Fi" },
  parking: { fr: "Parking", en: "Parking", ru: "Парковка" },
  equipment_included: { fr: "Équipement inclus", en: "Equipment included", ru: "Оборудование включено" },
  staff_included: { fr: "Personnel inclus", en: "Staff included", ru: "Персонал включён" },
  training_included: { fr: "Formation incluse", en: "Training included", ru: "Обучение включено" },
  private_rooms: { fr: "Salles privées", en: "Private rooms", ru: "Приватные комнаты" },
  shower: { fr: "Douche", en: "Shower", ru: "Душ" },
  reception: { fr: "Réception", en: "Reception", ru: "Ресепшн" },
  storage: { fr: "Stockage", en: "Storage", ru: "Хранение" },
};

interface AmenityListProps {
  amenities: string[];
  locale: string;
}

export function AmenityList({ amenities, locale }: AmenityListProps) {
  const t = useTranslations("salon");

  return (
    <div>
      <h3 className="font-[var(--font-playfair)] text-lg font-semibold text-text-primary mb-4">
        {t("amenities")}
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {amenities.map((amenity) => {
          const Icon = AMENITY_ICONS[amenity] || Wrench;
          const label = AMENITY_LABELS[amenity]?.[locale] || amenity;

          return (
            <div
              key={amenity}
              className="flex items-center gap-2.5 py-2.5 px-3 bg-cream/60 rounded-lg border border-gold/8"
            >
              <Icon className="w-4 h-4 text-gold-dark flex-shrink-0" strokeWidth={1.5} />
              <span className="font-[var(--font-montserrat)] text-xs font-medium text-text-primary">
                {label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
