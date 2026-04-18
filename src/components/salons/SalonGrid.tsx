"use client";

import { useState, useMemo, useCallback } from "react";
import { useTranslations } from "next-intl";
import { Search } from "lucide-react";
import { SalonCard } from "./SalonCard";
import {
  Filters,
  INITIAL_FILTERS,
  type FilterState,
} from "./Filters";
import type { Salon } from "@/types";

interface SalonGridProps {
  salons: Salon[];
}

export function SalonGrid({ salons }: SalonGridProps) {
  const t = useTranslations("filters");
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);

  const onChange = useCallback(
    <K extends keyof FilterState>(key: K, v: FilterState[K]) => {
      setFilters((prev) => ({ ...prev, [key]: v }));
    },
    [],
  );

  const onReset = useCallback(() => setFilters(INITIAL_FILTERS), []);

  const filtered = useMemo(() => {
    let result: Salon[] = [...salons];

    if (filters.category) {
      result = result.filter((s) => s.categories.includes(filters.category));
    }
    if (filters.district) {
      result = result.filter((s) => s.district === filters.district);
    }
    if (filters.maxPriceUsd !== null) {
      result = result.filter((s) => s.price_usd <= filters.maxPriceUsd!);
    }
    if (filters.minSurface !== null) {
      result = result.filter((s) => s.surface_sqm >= filters.minSurface!);
    }
    if (filters.minRevenueUsd !== null) {
      result = result.filter(
        (s) => s.monthly_revenue_usd >= filters.minRevenueUsd!,
      );
    }
    if (filters.minRooms !== null) {
      result = result.filter((s) => s.rooms_count >= filters.minRooms!);
    }

    switch (filters.sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price_usd - b.price_usd);
        break;
      case "price_desc":
        result.sort((a, b) => b.price_usd - a.price_usd);
        break;
      case "revenue_desc":
        result.sort(
          (a, b) => b.monthly_revenue_usd - a.monthly_revenue_usd,
        );
        break;
      case "surface_desc":
        result.sort((a, b) => b.surface_sqm - a.surface_sqm);
        break;
      default:
        result.sort(
          (a, b) =>
            new Date(b.created_at).getTime() -
            new Date(a.created_at).getTime(),
        );
    }

    return result;
  }, [filters]);

  return (
    <>
      <Filters value={filters} onChange={onChange} onReset={onReset} />

      <div className="mx-auto max-w-7xl px-5 sm:px-8 lg:px-12 py-10 sm:py-14">
        <div className="flex items-baseline justify-between mb-6">
          <p className="font-[var(--font-montserrat)] text-xs font-semibold tracking-wider uppercase text-text-secondary">
            {filtered.length} {t(filtered.length > 1 ? "resultsPlural" : "resultsSingular")}
          </p>
        </div>

        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-7">
            {filtered.map((salon) => (
              <SalonCard key={salon.id} salon={salon} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <div className="w-16 h-16 flex items-center justify-center rounded-full bg-gold/10 mb-6">
              <Search className="w-7 h-7 text-gold/50" />
            </div>
            <p className="font-[var(--font-playfair)] text-xl text-text-primary mb-2">
              {t("noResults")}
            </p>
            <button
              onClick={onReset}
              className="mt-4 font-[var(--font-montserrat)] text-sm font-semibold text-gold-dark hover:text-gold transition-colors"
            >
              {t("resetFilters")}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
