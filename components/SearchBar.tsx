"use client";

import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import { Search } from "lucide-react";

interface SearchBarProps {
    onSearch: (query: string) => void;
    onTabChange: (tab: "MOVIE" | "ANIME") => void;
}

export default function SearchBar({ onSearch, onTabChange }: SearchBarProps) {
    const [query, setQuery] = useState("");
    const [activeTab, setActiveTab] = useState<"MOVIE" | "ANIME">("MOVIE");
    const [debouncedQuery] = useDebounce(query, 500);

    useEffect(() => {
        onSearch(debouncedQuery);
    }, [debouncedQuery, onSearch]);

    const handleTabChange = (tab: "MOVIE" | "ANIME") => {
        setActiveTab(tab);
        onTabChange(tab);
    };

    return (
        <div className="w-full max-w-2xl mx-auto">
            <div className="relative">
                <Search
                    size={18}
                    className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
                />
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search movie or anime..."
                    className="w-full pl-11 pr-4 py-3 rounded-full border-2 border-gray-300 focus:border-blue-500 focus:outline-none text-black"
                />
            </div>

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