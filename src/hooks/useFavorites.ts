"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@/lib/supabase/client";

const STORAGE_KEY = "siamluxe-favorites";

function getStoredFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
}

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();

    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        setUserId(user.id);
        // Load from Supabase
        supabase
          .from("favorites")
          .select("salon_id")
          .eq("user_id", user.id)
          .then(({ data }) => {
            setFavorites(data?.map((f) => f.salon_id) ?? []);
          });
      } else {
        // Fallback to localStorage
        setFavorites(getStoredFavorites());
      }
    });
  }, []);

  const toggleFavorite = useCallback(
    async (salonId: string) => {
      const isCurrentlyFavorite = favorites.includes(salonId);
      const next = isCurrentlyFavorite
        ? favorites.filter((id) => id !== salonId)
        : [...favorites, salonId];

      // Optimistic update
      setFavorites(next);

      if (userId) {
        const supabase = createClient();
        if (isCurrentlyFavorite) {
          await supabase
            .from("favorites")
            .delete()
            .eq("user_id", userId)
            .eq("salon_id", salonId);
        } else {
          await supabase
            .from("favorites")
            .insert({ user_id: userId, salon_id: salonId });
        }
      } else {
        // localStorage fallback
        localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      }
    },
    [favorites, userId]
  );

  const isFavorite = useCallback(
    (salonId: string) => favorites.includes(salonId),
    [favorites]
  );

  return { favorites, toggleFavorite, isFavorite };
}
