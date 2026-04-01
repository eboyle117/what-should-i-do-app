"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";

export default function ResultsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addFavorite } = useFavorites();

  const [songs, setSongs] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);

  const mood = searchParams.get("mood");
  const duration = searchParams.get("duration") || "quick";

  const [result, setResult] = useState("");
  const [saved, setSaved] = useState(false);

  // 🎬 MOVIE API
  const getMovie = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();

      setResult("🎬 Trending Movies");
      setMovies(data);
      setSongs([]);
    } catch {
      fallbackSuggestion();
    }
  };

  // 🎵 MUSIC API
  const getMusic = async () => {
    try {
      const res = await fetch("/api/music");
      const data = await res.json();

      setResult("🎵 Trending Songs");
      setSongs(data);
      setMovies([]);
    } catch {
      fallbackSuggestion();
    }
  };

  // 💡 suggestions fallback
  const suggestions: any = {
    chill: {
      quick: [
        "Scroll TikTok 📱",
        "Listen to music 🎧",
        "Sit outside 🌿",
        "Watch YouTube ▶️",
        "Make a drink ☕",
      ],
      long: [
        "Watch a movie 🍿",
        "Go for a walk 🚶‍♀️",
        "Read a book 📖",
        "Start a show 📺",
        "Coffee date ☕",
      ],
    },
    social: {
      quick: [
        "Text a friend 💬",
        "Send a meme 😂",
        "Call someone 📞",
        "Reply to messages 📲",
        "Make plans 📅",
      ],
      long: [
        "Go out for food 🍔",
        "Hang out 🎉",
        "Go to a bar 🍹",
        "Visit someone 🏡",
        "Adventure 🚗",
      ],
    },
    productive: {
      quick: [
        "Clean desk 🧹",
        "Reply to emails 📧",
        "Organize notes 🗂️",
        "Make a to-do list 📝",
        "Quick workout 💪",
      ],
      long: [
        "Deep work 💻",
        "Go to gym 🏋️‍♀️",
        "Clean room 🧼",
        "Work on project 🚀",
        "Study 📚",
      ],
    },
    selfcare: {
      quick: [
        "Skincare 🧴",
        "Stretch 🧘‍♀️",
        "Drink water 💧",
        "Breathe 🌬️",
        "Fresh air 🌿",
      ],
      long: [
        "Long shower 🚿",
        "Journal 📓",
        "Self-care night 🛁",
        "Meditate 🧘‍♀️",
        "Relax 🌙",
      ],
    },
  };

  const fallbackSuggestion = () => {
    if (!mood) return;

    const list = suggestions[mood][duration];
    const random = list[Math.floor(Math.random() * list.length)];

    setResult(random);
    setSongs([]);
    setMovies([]);
  };

  // 🔥 main logic
  useEffect(() => {
    if (!mood) return;

    const useAPI = Math.random() < 0.6;

    if (mood === "chill" && useAPI) {
      getMusic();
    } else if (mood === "social" && useAPI) {
      getMovie();
    } else {
      fallbackSuggestion();
    }
  }, [mood, duration]);

  const saveFavorite = () => {
    if (!session) {
      signIn("google");
      return;
    }

    if (!result) return;

    addFavorite(result);

    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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

        <button
          onClick={() => router.push("/")}
          className="px-3 py-1 text-sm bg-black text-white rounded-lg hover:bg-gray-800 transition cursor-pointer self-start"
        >
          ← Back
        </button>

        <h1 className="text-3xl font-bold text-gray-800">
          Your Activity 🎯
        </h1>

        {/* RESULT + BANNERS */}
        <div className="flex flex-col items-center gap-4 w-full">
          <p className="text-xl text-gray-900">{result}</p>

          {/* 🎵 SONGS */}
          {songs.length > 0 && (
            <div className="flex gap-3 overflow-x-auto w-full">
              {songs.map((song, i) => (
                <a
                  key={i}
                  href={song.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="min-w-[150px] bg-white p-3 rounded-xl shadow hover:scale-105 transition cursor-pointer"
                >
                  <p className="font-semibold text-sm">{song.name}</p>
                  <p className="text-xs text-gray-500">{song.artist}</p>
                </a>
              ))}
            </div>
          )}

          {/* 🎬 MOVIES */}
          {movies.length > 0 && (
            <div className="flex gap-3 overflow-x-auto w-full">
              {movies.map((movie, i) => (
                <div
                  key={i}
                  className="min-w-[120px] cursor-pointer hover:scale-105 transition"
                >
                  <img
                    src={movie.poster}
                    className="rounded-xl"
                  />
                  <p className="text-xs mt-1">{movie.title}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <button
          onClick={saveFavorite}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition cursor-pointer"
        >
          {saved ? "✅ Saved!" : "❤️ Save this"}
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