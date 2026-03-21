"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const result = searchParams.get("activity") || "";

  const [favorites, setFavorites] = useState<string[]>([]);

  // Load favorites from localStorage
  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  // Save current result to favorites
  const saveFavorite = () => {
    // don't save if result is empty or placeholder
    if (!result || result === "Pick a mood ✨") return;

    if (!favorites.includes(result)) {
      const updated = [...favorites, result];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  // Remove a favorite from preview (optional)
  const removeFavorite = (item: string) => {
    const updated = favorites.filter((f) => f !== item);
    setFavorites(updated);
    localStorage.setItem("favorites", JSON.stringify(updated));
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 p-4">
      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl text-center w-full max-w-md flex flex-col gap-4">

        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition self-start mb-4"
        >
          ← Back
        </button>

        {/* Current activity */}
        <h1 className="text-3xl font-bold mb-2 text-gray-800">Your Activity 🎯</h1>

        {/* Result text + Spotify link */}
        <div className="flex flex-col items-center gap-2">
          <p className="text-xl text-gray-900">{result}</p>
          {result.toLowerCase().includes("music") && (
            <a
              href="https://open.spotify.com"
              target="_blank"
              className="text-green-600 underline"
            >
              🎵 Open Spotify
            </a>
          )}
        </div>

        {/* Save this button */}
        <button
          onClick={saveFavorite}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          ❤️ Save this
        </button>

        {/* View Favorites link */}
        <button
          onClick={() => router.push("/favorites")}
          className="mt-2 text-sm underline text-gray-800 hover:text-black transition"
        >
          View Favorites →
        </button>

        {/* Optional Favorites preview */}
        {favorites.length > 0 && (
          <div className="mt-4 text-left">
            <h3 className="text-lg font-bold text-gray-700 mb-2">Favorites Preview</h3>
            <ul className="flex flex-col gap-2">
              {favorites.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white/70 px-3 py-2 rounded-lg"
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
          </div>
        )}

      </div>
    </main>
  );
}