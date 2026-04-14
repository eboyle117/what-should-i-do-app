"use client";

import { useEffect, useState } from "react";

export function useFavorites() {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFavorites = async () => {
    try {
      const res = await fetch("/api/favorites");
      const data = await res.json();
      setFavorites(data.favorites || []);
    } catch (err) {
      console.error("Failed to fetch favorites", err);
      setFavorites([]);
    } finally {
      setIsLoading(false); // ✅ THIS FIXES YOUR ISSUE
    }
  };

  useEffect(() => {
    fetchFavorites();
  }, []);

  const addFavorite = async (activity: string) => {
    await fetch("/api/favorites", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ activity }),
    });

    fetchFavorites(); // refresh list
  };

  const removeFavorite = async (activity: string) => {
    await fetch(`/api/favorites?activity=${encodeURIComponent(activity)}`, {
      method: "DELETE",
    });

    fetchFavorites(); // refresh list
  };

  return {
    favorites,
    isLoading,
    addFavorite,
    removeFavorite,
  };
}