"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/components/AuthProvider";

export function useFavorites() {
  const { session, refetch: refetchAuth } = useAuth();
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (session?.user) {
      try {
        const res = await fetch("/api/favorites");
        const data = await res.json();
        setFavorites(data.favorites ?? []);
      } catch {
        setFavorites([]);
      }
    } else {
      const stored = localStorage.getItem("favorites");
      setFavorites(stored ? JSON.parse(stored) : []);
    }
    setIsLoading(false);
  }, [session?.user]);

  useEffect(() => {
    setIsLoading(true);
    fetchFavorites();
  }, [fetchFavorites]);

  const addFavorite = useCallback(
    async (activity: string) => {
      if (!activity?.trim()) return;

      if (session?.user) {
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ activity: activity.trim() }),
        });
        if (res.ok) {
          setFavorites((prev) =>
            prev.includes(activity) ? prev : [...prev, activity]
          );
        }
      } else {
        const stored = localStorage.getItem("favorites");
        const current = stored ? JSON.parse(stored) : [];
        if (!current.includes(activity)) {
          const updated = [...current, activity];
          localStorage.setItem("favorites", JSON.stringify(updated));
          setFavorites(updated);
        }
      }
    },
    [session?.user]
  );

  const removeFavorite = useCallback(
    async (activity: string) => {
      if (session?.user) {
        const res = await fetch(`/api/favorites?activity=${encodeURIComponent(activity)}`, {
          method: "DELETE",
        });
        if (res.ok) {
          setFavorites((prev) => prev.filter((f) => f !== activity));
        }
      } else {
        const updated = favorites.filter((f) => f !== activity);
        localStorage.setItem("favorites", JSON.stringify(updated));
        setFavorites(updated);
      }
    },
    [session?.user, favorites]
  );

  return { favorites, isLoading, addFavorite, removeFavorite, refetch: fetchFavorites };
}
