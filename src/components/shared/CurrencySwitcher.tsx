"use client";

import { useCurrency } from "./CurrencyProvider";
import type { Currency } from "@/types";

const OPTIONS: { code: Currency; symbol: string }[] = [
  { code: "USD", symbol: "$" },
  { code: "EUR", symbol: "€" },
  { code: "THB", symbol: "฿" },
];

interface Props {
  scrolled?: boolean;
  compact?: boolean;
}

export function CurrencySwitcher({ scrolled = true, compact = false }: Props) {
  const { currency, setCurrency } = useCurrency();

  return (
    <div
      className={`inline-flex items-center gap-0.5 rounded-full p-0.5 border transition-colors duration-300 ${
        scrolled
          ? "bg-white-soft border-gold/15"
          : "bg-white/10 border-white/20 backdrop-blur-sm"
      }`}
      role="group"
      aria-label="Devise"
    >
      {OPTIONS.map(({ code, symbol }) => {
        const active = code === currency;
        return (
          <button
            key={code}
            type="button"
            onClick={() => setCurrency(code)}
            aria-pressed={active}
            className={`font-[var(--font-montserrat)] text-xs font-semibold tracking-wide rounded-full transition-all duration-200 ${
              compact ? "px-2 py-1" : "px-2.5 py-1"
            } ${
              active
                ? "bg-gold text-white shadow-sm"
                : scrolled
                  ? "text-text-secondary hover:text-gold-dark"
                  : "text-white/70 hover:text-white"
            }`}
          >
            <span className="mr-0.5">{symbol}</span>
            {code}
          </button>
        );
      })}
    </div>
  );
}
