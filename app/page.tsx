"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [duration, setDuration] = useState<string>("quick");
  useEffect(() => {
    const saved = localStorage.getItem("duration");

    if (saved === "quick" || saved === "long") {
      setDuration(saved);
    }
  }, []);
  const router = useRouter();
  const [result, setResult] = useState("Pick a mood ✨");
  const [favorites, setFavorites] = useState<string[]>([]);

  const suggestions: { [key: string]: { quick: string[]; long: string[] } } = {
    chill: {
      quick: ["Listen to music 🎵", "Watch a short video", "Sit outside"],
      long: ["Watch a movie", "Go for a long walk", "Read a book"],
    },
    social: {
      quick: ["Text a friend", "Send a meme"],
      long: ["Go out for food", "Hang out with someone"],
    },
    productive: {
      quick: ["Clean your desk", "Reply to emails"],
      long: ["Deep work session", "Go to the gym"],
    },
    selfcare: {
      quick: ["Do skincare", "Stretch"],
      long: ["Take a long shower", "Journal deeply"],
    },
  };

  const getSuggestion = (mood: string) => {
    const moodData = suggestions[mood];
    const list = moodData[time as "quick" | "long"];
    const random = list[Math.floor(Math.random() * list.length)];
    setResult(random);
    router.push(`/results?activity=${encodeURIComponent(random)}`);
  };

  const saveFavorite = () => {
  const stored = localStorage.getItem("favorites");
  const current = stored ? JSON.parse(stored) : [];

  if (!current.includes(result)) {
    const updated = [...current, result];
    localStorage.setItem("favorites", JSON.stringify(updated));
  }
  };

  const removeFavorite = (item: string) => {
    setFavorites(favorites.filter((fav) => fav !== item));
  };
  const handleSelect = (type: string) => {
  setDuration(type);
  localStorage.setItem("duration", type);
  };

  const handleMoodClick = (mood: string) => {
  router.push(`/results?mood=${mood}&duration=${duration}`);
};

const surpriseMe = () => {
  const moods = ["chill", "social", "productive", "selfcare"];
  const randomMood = moods[Math.floor(Math.random() * moods.length)];
  handleMoodClick(randomMood);
};
  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-100 p-4">
      
      <div className="backdrop-blur-lg bg-white/30 p-8 rounded-3xl shadow-xl flex flex-col items-center gap-6 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          What Should I Do Today?
        </h1>

        {/* Time Selector */}
        <div className="flex gap-4">
        <button
        onClick={() => handleSelect("quick")}
        className={`px-4 py-2 rounded-xl cursor-pointer transition ${
        duration === "quick"
        ? "bg-black text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
        }`}
        >
       Quick
        </button>

        <button
        onClick={() => handleSelect("long")}
        className={`px-4 py-2 rounded-xl cursor-pointer transition ${
        duration === "long"
        ? "bg-black text-white"
        : "bg-gray-200 text-gray-800 hover:bg-gray-300"
      }`}
        >
        Long
        </button>
        
      </div>
      {/* 👇 MOVE FAVORITES HERE */}
      <button
      onClick={() => router.push("/favorites")}
      className="text-sm underline text-gray-800 hover:text-black cursor-pointer"
      >
      View Favorites →
      </button>
        <h2 className="text-xl font-semibold text-gray-800 mt-4 mb-4 text-center">
        Pick a mood 💭
        </h2>
        {/* Mood Buttons */}
<div className="flex flex-wrap gap-3 justify-center">

  <button
    onClick={() => handleMoodClick("chill")}
    className="px-4 py-2 bg-purple-500 text-white rounded-xl shadow hover:scale-105 hover:bg-purple-600 transition cursor-pointer"
  >
    😌 Chill
  </button>

  <button
    onClick={() => handleMoodClick("social")}
    className="px-4 py-2 bg-pink-500 text-white rounded-xl shadow hover:scale-105 hover:bg-pink-600 transition cursor-pointer"
  >
    🎉 Social
  </button>

  <button
    onClick={() => handleMoodClick("productive")}
    className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:scale-105 hover:bg-blue-600 transition cursor-pointer"
  >
    💪 Productive
  </button>

  <button
    onClick={() => handleMoodClick("selfcare")}
    className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:scale-105 hover:bg-green-600 transition cursor-pointer"
  >
    🌿 Self-Care
  </button>

  <button
    onClick={surpriseMe}
    className="px-4 py-2 bg-yellow-400 text-black rounded-xl shadow hover:scale-105 hover:bg-yellow-500 transition cursor-pointer"
  >
    🎲 Surprise Me
  </button>

</div>

        

        {/* Save Button */}

        {/* Favorites List */}
        {favorites.length > 0 && (
          <div className="w-full mt-4">
            <h3 className="text-lg font-bold text-gray-700 mb-2">
              Your Favorites
            </h3>
            <ul className="flex flex-col gap-2">
              {favorites.map((item, index) => (
                <li
                  key={index}
                  className="flex justify-between items-center bg-white/60 px-3 py-2 rounded-lg"
                >
                  <span>{item}</span>
                  <button
                    onClick={() => removeFavorite(item)}
                    className="text-red-500 cursor-pointer hover:text-red-700 transition"
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