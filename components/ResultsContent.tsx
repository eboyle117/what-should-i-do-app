"use client";

import { useSession, signIn } from "next-auth/react";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useFavorites } from "@/hooks/useFavorites";
import { useRef } from "react";

export default function ResultsContent() {
  const { data: session } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { addFavorite } = useFavorites();
  const hasRun = useRef(false);

  const [songs, setSongs] = useState<any[]>([]);
  const [movies, setMovies] = useState<any[]>([]);

  const mood = searchParams.get("mood");
  const durationParam = searchParams.get("duration");
  const duration = durationParam === "long" ? "long" : "quick";

  const [result, setResult] = useState("");
  const [saved, setSaved] = useState(false);

  // 🎬 MOVIE API
  const getMovie = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();

      if (!data || data.error) {
        setResult("Watch a movie 🍿");
        return;
      }

      setResult("Watch a movie🎬");
      setMovies(data);
      setSongs([]);
    } catch {
      setResult("Watch a movie 🍿");
    }
  };

  // 🎵 MUSIC API
  const getMusic = async () => {
    try {
      const res = await fetch("/api/music");
      const data = await res.json();

      if (!data || data.error) {
        setResult("Listen to music 🎵");
        return;
      }

      setResult("Listen to music🎵");
      setSongs(data);
      setMovies([]);
    } catch {
      setResult("Listen to music 🎵");
    }
  };

  // 💡 suggestions
  const suggestions: any = {
    chill: {
      quick: [
        "Scroll TikTok 📱",
        "Listen to music 🎵",
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

useEffect(() => {
  if (!mood) return;

  const run = async () => {
    const moodData = suggestions[mood as keyof typeof suggestions];
    if (!moodData) return;

    const list = moodData[duration as "quick" | "long"];
    const random =
      list[Math.floor(Math.random() * list.length)];

    // 👉 handle special cases
    if (random.toLowerCase().includes("music")) {
      await getMusic();
      return;
    }

    if (random.toLowerCase().includes("movie")) {
      await getMovie();
      return;
    }

    // 👉 normal activity
    setResult(random);
  };

  run();
}, [mood, duration]);

  const saveFavorite = async () => {
  if (!session) {
    signIn("google");
    return;
  }

  if (!result) return;

  await fetch("/api/favorites", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ activity: result }),
  });

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

        <div className="flex flex-col items-center gap-4 w-full">
          {!result ? (
            <p className="text-gray-400">Finding something for you...</p>
          ) : (
            <p className="text-xl text-gray-900">{result}</p>
          )}

          {songs.length > 0 && (
  <div className="flex gap-2 overflow-x-auto w-full pb-2">
    {songs.map((song, i) => (
      <a
        key={i}
        href={song.url}
        target="_blank"
        rel="noopener noreferrer"
        className="min-w-[180px] bg-[#121212] text-white px-3 py-2 rounded-lg shadow-sm hover:bg-[#1a1a1a] hover:scale-[1.02] transition cursor-pointer flex items-center gap-3"
      >
        {/* Spotify logo */}
        <img
          src="https://upload.wikimedia.org/wikipedia/commons/1/19/Spotify_logo_without_text.svg"
          className="w-5 h-5 flex-shrink-0"
        />

        {/* Text (LEFT ALIGNED) */}
        <div className="flex flex-col text-left leading-tight overflow-hidden">
          <p className="text-sm font-medium truncate">
            {song.name}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {song.artist}
          </p>
        </div>
      </a>
    ))}
  </div>
)}

          {movies.length > 0 && (
            <div className="flex gap-3 overflow-x-auto w-full">                                             
              {movies.map((movie, i) => (
                <a
                  key={i}
                  href={`https://www.themoviedb.org/search?query=${encodeURIComponent(movie.title)}`}
                  target="_blank"
                  className="min-w-[130px]"
                >
                  <img src={movie.poster} className="rounded-xl" />
                </a>
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