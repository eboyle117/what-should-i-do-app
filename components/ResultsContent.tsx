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

  const mood = searchParams.get("mood");
  const duration = searchParams.get("duration") || "quick";

  const [result, setResult] = useState("");
  const [link, setLink] = useState("");
  const [saved, setSaved] = useState(false);

  // 🎬 MOVIE API
  const getMovie = async () => {
    try {
      const res = await fetch("/api/movies");
      const data = await res.json();
      setResult(`🎬 Watch: ${data.title}`);
      setLink("");
    } catch {
      fallbackSuggestion();
    }
  };

  // 🎵 MUSIC API
  const getMusic = async () => {
    try {
      const res = await fetch("/api/music");
      const data = await res.json();
      setResult("🎵 Listen to music");
      setLink(data.url);
    } catch {
      fallbackSuggestion();
    }
  };

  // 💡 FULL SUGGESTIONS SYSTEM
  const suggestions: any = {
    chill: {
      quick: [
        "Scroll TikTok for 10 mins 📱",
        "Listen to music 🎧",
        "Sit outside 🌿",
        "Watch a short YouTube video ▶️",
        "Make a cozy drink ☕",
      ],
      long: [
        "Watch a movie 🍿",
        "Go for a long walk 🚶‍♀️",
        "Read a book 📖",
        "Start a new TV show 📺",
        "Have a solo coffee date ☕",
      ],
    },
    social: {
      quick: [
        "Text a friend 💬",
        "Send someone a meme 😂",
        "Call a friend 📞",
        "Reply to messages 📲",
        "Make plans for later 📅",
      ],
      long: [
        "Go out for food 🍔",
        "Hang out with friends 🎉",
        "Go to a bar 🍹",
        "Visit someone 🏡",
        "Go on a spontaneous adventure 🚗",
      ],
    },
    productive: {
      quick: [
        "Clean your desk 🧹",
        "Reply to emails 📧",
        "Organize your notes 🗂️",
        "Make a to-do list 📝",
        "Do a quick workout 💪",
      ],
      long: [
        "Deep work session 💻",
        "Go to the gym 🏋️‍♀️",
        "Clean your entire room 🧼",
        "Work on a project 🚀",
        "Study something new 📚",
      ],
    },
    selfcare: {
      quick: [
        "Do skincare 🧴",
        "Stretch 🧘‍♀️",
        "Drink water 💧",
        "Take deep breaths 🌬️",
        "Step outside for fresh air 🌿",
      ],
      long: [
        "Take a long shower 🚿",
        "Journal your thoughts 📓",
        "Do a full self-care routine 🛁",
        "Meditate 🧘‍♀️",
        "Have a relaxing night routine 🌙",
      ],
    },
  };

  // fallback suggestion
  const fallbackSuggestion = () => {
    if (!mood) return;

    const list = suggestions[mood][duration];
    const random = list[Math.floor(Math.random() * list.length)];

    setResult(random);
    setLink("");
  };

  // 🔥 MAIN LOGIC
  useEffect(() => {
    if (!mood) return;

    // randomly decide API vs normal suggestion
    const useAPI = Math.random() < 0.5;

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

        <div className="flex flex-col items-center gap-2">
          <p className="text-xl text-gray-900">{result}</p>

          {link && (
            <a
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 underline text-sm"
            >
              Open Spotify
            </a>
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