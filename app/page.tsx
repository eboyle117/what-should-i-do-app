"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState("Pick a mood ✨");
  const [time, setTime] = useState("quick");
  const [favorites, setFavorites] = useState<string[]>([]);

  const suggestions: { [key: string]: { quick: string[]; long: string[] } } = {
    chill: {
      quick: ["Listen to 3 songs", "Watch a short video", "Sit outside"],
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
  };

  const surpriseMe = () => {
    const moods = Object.keys(suggestions);
    const randomMood = moods[Math.floor(Math.random() * moods.length)];
    getSuggestion(randomMood);
  };

  const saveFavorite = () => {
    if (result && !favorites.includes(result)) {
      setFavorites([...favorites, result]);
    }
  };

  const removeFavorite = (item: string) => {
    setFavorites(favorites.filter((fav) => fav !== item));
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-200 via-pink-200 to-yellow-100 p-4">
      
      <div className="backdrop-blur-lg bg-white/30 p-8 rounded-3xl shadow-xl flex flex-col items-center gap-6 w-full max-w-md">
        
        <h1 className="text-3xl font-bold text-gray-800 text-center">
          What Should I Do Today?
        </h1>

        {/* Time Selector */}
        <div className="flex gap-3">
          <button
            onClick={() => setTime("quick")}
            className={`px-3 py-1 rounded-full transition ${
              time === "quick"
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            ⚡ Quick
          </button>

          <button
            onClick={() => setTime("long")}
            className={`px-3 py-1 rounded-full transition ${
              time === "long"
                ? "bg-black text-white"
                : "bg-gray-300 text-gray-800 hover:bg-gray-400"
            }`}
          >
            🕒 Long
          </button>
        </div>

        {/* Mood Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={() => getSuggestion("chill")}
            className="px-4 py-2 bg-purple-500 text-white rounded-xl shadow hover:scale-105 hover:bg-purple-600 transition"
          >
            😌 Chill
          </button>

          <button
            onClick={() => getSuggestion("social")}
            className="px-4 py-2 bg-pink-500 text-white rounded-xl shadow hover:scale-105 hover:bg-pink-600 transition"
          >
            🎉 Social
          </button>

          <button
            onClick={() => getSuggestion("productive")}
            className="px-4 py-2 bg-blue-500 text-white rounded-xl shadow hover:scale-105 hover:bg-blue-600 transition"
          >
            💪 Productive
          </button>

          <button
            onClick={() => getSuggestion("selfcare")}
            className="px-4 py-2 bg-green-500 text-white rounded-xl shadow hover:scale-105 hover:bg-green-600 transition"
          >
            🌿 Self-Care
          </button>

          <button
            onClick={surpriseMe}
            className="px-4 py-2 bg-yellow-400 text-black rounded-xl shadow hover:scale-105 hover:bg-yellow-500 transition"
          >
            🎲 Surprise Me
          </button>
        </div>

        {/* Result */}
        <div className="text-xl font-semibold text-gray-800 text-center">
          {result}
        </div>

        {/* Save Button */}
        <button
          onClick={saveFavorite}
          className="px-4 py-2 bg-black text-white rounded-xl hover:bg-gray-800 transition"
        >
          ❤️ Save this
        </button>

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