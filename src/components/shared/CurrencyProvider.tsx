"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { Currency } from "@/types";
import {
  CURRENCY_LOCALES,
  convertFromUsd,
} from "@/lib/utils";

const STORAGE_KEY = "siamluxe:currency";
const DEFAULT_CURRENCY: Currency = "USD";

interface CurrencyContextValue {
  currency: Currency;
  setCurrency: (c: Currency) => void;
  format: (usdAmount: number) => string;
  convert: (usdAmount: number) => number;
}

const CurrencyContext = createContext<CurrencyContextValue | null>(null);

export function CurrencyProvider({ children }: { children: ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(DEFAULT_CURRENCY);

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored === "USD" || stored === "EUR" || stored === "THB") {
      setCurrencyState(stored);
    }
  }, []);

  const setCurrency = useCallback((c: Currency) => {
    setCurrencyState(c);
    window.localStorage.setItem(STORAGE_KEY, c);
  }, []);

  const value = useMemo<CurrencyContextValue>(() => {
    const format = (usdAmount: number) =>
      new Intl.NumberFormat(CURRENCY_LOCALES[currency], {
        style: "currency",
        currency,
        maximumFractionDigits: 0,
      }).format(convertFromUsd(usdAmount, currency));

    const convert = (usdAmount: number) => convertFromUsd(usdAmount, currency);

    return { currency, setCurrency, format, convert };
  }, [currency, setCurrency]);

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency(): CurrencyContextValue {
  const ctx = useContext(CurrencyContext);
  if (!ctx) {
    throw new Error("useCurrency must be used within CurrencyProvider");
  }
  return ctx;
}
