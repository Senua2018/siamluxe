"use client";

import { useTranslations } from "next-intl";
import { SlidersHorizontal, X } from "lucide-react";
import { useCurrency } from "@/components/shared/CurrencyProvider";
import {
  CATEGORIES,
  DISTRICTS,
} from "@/lib/constants";
import {
  CURRENCY_SYMBOLS,
  convertFromUsd,
} from "@/lib/utils";

export const DEFAULT_SORT = "newest";

export interface FilterState {
  category: string;
  district: string;
  maxPriceUsd: number | null;
  minSurface: number | null;
  minRevenueUsd: number | null;
  minRooms: number | null;
  sortBy: string;
}

export const INITIAL_FILTERS: FilterState = {
  category: "",
  district: "",
  maxPriceUsd: null,
  minSurface: null,
  minRevenueUsd: null,
  minRooms: null,
  sortBy: DEFAULT_SORT,
};

const PRICE_STEPS_USD = [40000, 60000, 90000, 120000];
const SURFACE_STEPS = [60, 100, 150, 200];
const REVENUE_STEPS_USD = [5000, 8000, 12000, 18000];
const ROOMS_STEPS = [4, 6, 8, 12];

interface FiltersProps {
  value: FilterState;
  onChange: <K extends keyof FilterState>(key: K, v: FilterState[K]) => void;
  onReset: () => void;
}

export function Filters({ value, onChange, onReset }: FiltersProps) {
  const t = useTranslations("filters");
  const catT = useTranslations("categories");
  const { currency } = useCurrency();

  const hasFilters =
    value.category !== "" ||
    value.district !== "" ||
    value.maxPriceUsd !== null ||
    value.minSurface !== null ||
    value.minRevenueUsd !== null ||
    value.minRooms !== null ||
    value.sortBy !== DEFAULT_SORT;

  const selectClass =
    "font-[var(--font-montserrat)] text-xs font-medium bg-white-soft border border-gold/15 rounded-full px-4 py-2 text-text-primary focus:outline-none focus:border-gold/40 transition-colors cursor-pointer appearance-none pr-8 bg-[url('data:image/svg+xml;charset=utf-8,%3Csvg%20xmlns%3D%22http%3A//www.w3.org/2000/svg%22%20width%3D%2212%22%20height%3D%2212%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22%236B5344%22%20stroke-width%3D%222%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22/%3E%3C/svg%3E')] bg-no-repeat bg-[right_0.75rem_center]";

  const formatStep = (usd: number) => {
    const v = convertFromUsd(usd, currency);
    const short =
      currency === "THB" ? `${Math.round(v / 1000)}k` : v >= 1000 ? `${Math.round(v / 1000)}k` : String(v);
    return `${CURRENCY_SYMBOLS[currency]}${short}`;
  };

  return (
    <div className="sticky top-20 z-30 bg-cream/95 backdrop-blur-md border-b border-gold/10 shadow-warm">
      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-4">
        <div className="flex flex-col lg:flex-row items-start lg:items-center gap-3 lg:gap-4">
          {/* Icon */}
          <div className="flex items-center gap-2 text-text-secondary shrink-0">
            <SlidersHorizontal className="w-4 h-4 text-gold" />
            <span className="font-[var(--font-montserrat)] text-xs font-semibold tracking-wider uppercase hidden lg:inline">
              {t("filtersLabel")}
            </span>
          </div>

          {/* Filter selects */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {/* Category */}
            <select
              value={value.category}
              onChange={(e) => onChange("category", e.target.value)}
              className={selectClass}
              aria-label={t("category")}
            >
              <option value="">
                {t("category")} — {t("all")}
              </option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>
                  {catT(cat)}
                </option>
              ))}
            </select>

            {/* District */}
            <select
              value={value.district}
              onChange={(e) => onChange("district", e.target.value)}
              className={selectClass}
              aria-label={t("district")}
            >
              <option value="">
                {t("district")} — {t("all")}
              </option>
              {DISTRICTS.map((d) => (
                <option key={d} value={d}>
                  {d}
                </option>
              ))}
            </select>

            {/* Max price */}
            <select
              value={value.maxPriceUsd ?? ""}
              onChange={(e) =>
                onChange(
                  "maxPriceUsd",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className={selectClass}
              aria-label={t("maxPrice")}
            >
              <option value="">{t("maxPrice")}</option>
              {PRICE_STEPS_USD.map((p) => (
                <option key={p} value={p}>
                  ≤ {formatStep(p)}
                </option>
              ))}
            </select>

            {/* Min surface */}
            <select
              value={value.minSurface ?? ""}
              onChange={(e) =>
                onChange(
                  "minSurface",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className={selectClass}
              aria-label={t("minSurface")}
            >
              <option value="">{t("minSurface")}</option>
              {SURFACE_STEPS.map((s) => (
                <option key={s} value={s}>
                  ≥ {s} m²
                </option>
              ))}
            </select>

            {/* Min revenue */}
            <select
              value={value.minRevenueUsd ?? ""}
              onChange={(e) =>
                onChange(
                  "minRevenueUsd",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className={selectClass}
              aria-label={t("minRevenue")}
            >
              <option value="">{t("minRevenue")}</option>
              {REVENUE_STEPS_USD.map((r) => (
                <option key={r} value={r}>
                  ≥ {formatStep(r)} / {t("perMonthShort")}
                </option>
              ))}
            </select>

            {/* Min rooms */}
            <select
              value={value.minRooms ?? ""}
              onChange={(e) =>
                onChange(
                  "minRooms",
                  e.target.value === "" ? null : Number(e.target.value),
                )
              }
              className={selectClass}
              aria-label={t("minRooms")}
            >
              <option value="">{t("minRooms")}</option>
              {ROOMS_STEPS.map((r) => (
                <option key={r} value={r}>
                  ≥ {r} {t("roomsShort")}
                </option>
              ))}
            </select>

            {/* Sort */}
            <select
              value={value.sortBy}
              onChange={(e) => onChange("sortBy", e.target.value)}
              className={selectClass}
              aria-label={t("sortBy")}
            >
              <option value="newest">{t("newest")}</option>
              <option value="price_asc">{t("priceAsc")}</option>
              <option value="price_desc">{t("priceDesc")}</option>
              <option value="revenue_desc">{t("revenueDesc")}</option>
              <option value="surface_desc">{t("surfaceDesc")}</option>
            </select>
          </div>

          {/* Reset */}
          {hasFilters && (
            <button
              onClick={onReset}
              className="flex items-center gap-1.5 font-[var(--font-montserrat)] text-xs font-medium text-gold-dark hover:text-gold transition-colors shrink-0"
            >
              <X className="w-3.5 h-3.5" />
              {t("resetFilters")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
