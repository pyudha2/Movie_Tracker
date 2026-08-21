"use client";

import { useState } from "react";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onTabChange: (tab: "MOVIE" | "ANIME") => void;
}

export default function SearchBar({ onSearch, onTabChange }: SearchBarProps) {
    const [inputValue, setInputValue] = useState("");
    const [activeTab, setActiveTab] = useState<"MOVIE" | "ANIME">("MOVIE");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(inputValue.trim());
    };

    const handleTabChange = (tab: "MOVIE" | "ANIME") => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <form onSubmit={handleSubmit} className="relative">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Search movie or anime..."
                    className="w-full pl-11 pr-24 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-black"
                />
                <button
                    type="submit"
                    className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 px-4 rounded-full"
                >
                    Search
                </button>
            </form>

            <div className="flex gap-2 mt-3 justify-center">
                <button
                    onClick={() => handleTabChange("MOVIE")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "MOVIE"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                >
                    Movie
                </button>
                <button
                    onClick={() => handleTabChange("ANIME")}
                    className={`px-5 py-2 rounded-full text-sm font-medium transition-colors ${activeTab === "ANIME"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 text-gray-600"
                        }`}
                >
                    Anime
                </button>
            </div>
        </div>
    );
}