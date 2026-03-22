"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";

export default function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const result = searchParams.get("activity") || "Pick a mood ✨";

  const [favorites, setFavorites] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("favorites");
    if (stored) setFavorites(JSON.parse(stored));
  }, []);

  const saveFavorite = () => {
    if (!result || result === "Pick a mood ✨") return;

    if (!favorites.includes(result)) {
      const updated = [...favorites, result];
      setFavorites(updated);
      localStorage.setItem("favorites", JSON.stringify(updated));
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 p-4">
      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl text-center w-full max-w-md flex flex-col gap-4">

        <button
          onClick={() => router.push("/")}
          className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition self-start mb-4 cursor-pointer"
        >
          ← Back
        </button>
        </div>
        <h1 className="text-3xl font-bold text-gray-800">Your Activity 🎯</h1>

        <div className="flex flex-col items-center gap-2">
          <p className="text-xl text-gray-900">{result}</p>

         <div className="flex flex-col items-center gap-2">
         <p className="text-xl text-gray-900">{result}</p>

        {result.toLowerCase().includes("music") && (
        <a
        href="https://open.spotify.com"
        target="_blank"
        className="text-green-600 underline text-sm hover:text-green-700 transition"
        >
        Open Spotify
        </a>
     )}
        </div>

        <button
          onClick={saveFavorite}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition cursor-pointer"
        >
          ❤️ Save this
        </button>

        <button
          onClick={() => router.push("/favorites")}
          className="text-sm underline text-gray-800 hover:text-black cursor-pointer"
        >
          View Favorites →
        </button>

      </div>
    </main>
  );
}