"use client";

import { useRouter } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { useAuth } from "@/components/AuthProvider";

export default function FavoritesPage() {
  const router = useRouter();
  const { session } = useAuth();
  const { favorites, isLoading, removeFavorite } = useFavorites();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200 p-4">
      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md">
        {/* Back button */}
        <button
        onClick={() => router.push("/")}
        className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition self-start mb-4 cursor-pointer"
        >
        ← Back
        </button>
        <h1 className="text-2xl font-bold mb-4 text-gray-800">
          ❤️ Your Favorites
        </h1>

        {!session?.user && (
          <p className="text-sm text-gray-600 mb-3">
            Sign in with Google to save favorites to your account and access them from any device.
          </p>
        )}

        {isLoading ? (
          <p className="text-gray-700">Loading...</p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-700">No favorites yet</p>
        ) : (
          <ul className="flex flex-col gap-2">
            {favorites.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white/70 p-2 rounded-lg text-gray-900"
                >
                <span>{item}</span>
                <button
                  onClick={() => removeFavorite(item)}
                  className="text-red-500 hover:text-red-700 transition cursor-pointer"
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