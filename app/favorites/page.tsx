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
      <div className="bg-white/50 backdrop-blur-lg p-8 rounded-3xl shadow-xl w-full max-w-md flex flex-col gap-4">
        
        {/* Back button */}
        <button
          onClick={() => router.push("/")}
          className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer self-start"
        >
          ← Back
        </button>

        {/* Title */}
        <h1 className="text-2xl font-bold text-gray-800 text-center">
          ❤️ Your Favorites
        </h1>

        {/* Not signed in */}
        {!session?.user && (
          <p className="text-sm text-gray-600 text-center">
            Sign in with Google to save favorites to your account and access them from any device.
          </p>
        )}

        {/* Loading */}
        {isLoading ? (
          <p className="text-gray-700 text-center animate-pulse">
            Loading...
          </p>
        ) : favorites.length === 0 ? (
          <p className="text-gray-700 text-center">
            No favorites yet 💔
          </p>
        ) : (
          <ul className="flex flex-col gap-3 mt-2">
            {favorites.map((item, i) => (
              <li
                key={i}
                className="flex justify-between items-center bg-white/70 px-4 py-2 rounded-xl shadow-sm text-gray-900"
              >
                <span className="text-sm">{item}</span>

                <button
                  onClick={() => removeFavorite(item)}
                  className="text-red-500 hover:text-red-700 transition cursor-pointer text-sm"
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