"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";

export default function ResultsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addFavorite, favorites } = useFavorites();

  const mood = searchParams.get("mood");
  const duration = searchParams.get("duration");

  const suggestions = {
    chill: ["Watch a movie 🍿", "Listen to music 🎵"],
    social: ["Call a friend 📞", "Go out for drinks 🍹"],
    productive: ["Clean your room 🧹", "Finish a task ✅"],
    selfcare: ["Take a bath 🛁", "Do skincare 🧴"]
  };

  const moodList = suggestions[mood as keyof typeof suggestions];

  const [result, setResult] = useState<string>("");
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!moodList) return;
    const random = moodList[Math.floor(Math.random() * moodList.length)];
    setResult(random);
  }, [mood]);

  const saveFavorite = () => {
    if (!result || result === "Pick a mood ✨") return;
    if (favorites.includes(result)) {
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
      return;
    }
    addFavorite(result);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  // ✅ fallback if mood missing
  if (!mood) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <p className="text-gray-800">Something went wrong 😢</p>
        <button
          onClick={() => router.push("/")}
          className="px-4 py-2 bg-black text-white rounded-xl cursor-pointer"
        >
          Go back home
        </button>
      </div>
    );
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 to-pink-200 p-4">
      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md flex flex-col items-center text-center gap-6">
        
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer self-start"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800">
          Your Activity 🎯
        </h1>

        {/* Result */}
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

        {/* Save button */}
        <button
          onClick={saveFavorite}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition cursor-pointer"
        >
          {saved ? "✅ Saved!" : "❤️ Save this"}
        </button>

        {/* Favorites link */}
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