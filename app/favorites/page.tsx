"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function FavoritesPage() {
    const router = useRouter();
    const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const removeFavorite = (item: string) => {
    const updated = favorites.filter((f) => f !== item);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200 p-4">
      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md">
        {/* Back button */}
        <button
        onClick={() => router.push("/")}
        className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition self-start mb-4"
        >
        ← Back
        </button>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          ❤️ Your Favorites
        </h1>

        {favorites.length === 0 ? (
          <p className="text-gray-700">No favorites yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {favorites.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white/70 p-2 rounded-lg"
                >
                <span className="text-gray-900">{item}</span>
                <button
                  onClick={() => removeFavorite(item)}
                  className="text-red-500"
                >
                  ✕
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}