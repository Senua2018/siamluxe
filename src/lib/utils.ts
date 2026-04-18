import { type ClassValue, clsx } from "clsx";
import type { Currency } from "@/types";

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(" ");
}

export const CURRENCY_RATES: Record<Currency, number> = {
  USD: 1,
  EUR: 0.92,
  THB: 35,
};

export const CURRENCY_SYMBOLS: Record<Currency, string> = {
  USD: "$",
  EUR: "€",
  THB: "฿",
};

export const CURRENCY_LOCALES: Record<Currency, string> = {
  USD: "en-US",
  EUR: "fr-FR",
  THB: "th-TH",
};

export function convertFromUsd(usdAmount: number, target: Currency): number {
  return Math.round(usdAmount * CURRENCY_RATES[target]);
}

export function formatPrice(
  usdAmount: number,
  currency: Currency = "USD",
): string {
  const value = convertFromUsd(usdAmount, currency);
  return new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(value);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)+/g, "");
}

export function calcRoiPercent(monthlyRevenueUsd: number, priceUsd: number): number {
  if (priceUsd <= 0) return 0;
  return Math.round(((monthlyRevenueUsd * 12) / priceUsd) * 100);
}
