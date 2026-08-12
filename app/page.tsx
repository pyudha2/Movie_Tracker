"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import { searchAnime, getTopAnime } from "@/lib/jikan";
import Link from "next/link";

interface MediaItem {
  id: number;
  mediaType: "MOVIE" | "ANIME";
  title: string;
  posterUrl: string;
  year: string;
  status: string;
  rating: number;
  genres: string[];
}

interface TMDBMovieResult {
  id: number;
  title: string;
  poster_path: string | null;
  release_date: string;
  vote_average: number;
}

interface TMDBSearchResponse {
  results: TMDBMovieResult[];
}

interface JikanAnimeResult {
  mal_id: number;
  title: string;
  images: {
    jpg: {
      image_url: string;
    };
  };
  year: number | null;
  status: string;
  score: number | null;
  genres: { name: string }[];
}

interface JikanSearchResponse {
  data: JikanAnimeResult[];
}

export default function Home() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"MOVIE" | "ANIME">("MOVIE");

  const { data, isLoading, isError } = useQuery<MediaItem[]>({
    queryKey: ["media", tab, query],
    queryFn: async () => {
      if (tab === "MOVIE") {
        const res = await fetch(`/api/movies?query=${query}`);
        const result: TMDBSearchResponse = await res.json();

        return result.results.map((movie): MediaItem => ({
          id: movie.id,
          mediaType: "MOVIE",
          title: movie.title,
          posterUrl: movie.poster_path
            ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
            : "/placeholder.png",
          year: movie.release_date?.slice(0, 4) ?? "-",
          status: "Released",
          rating: movie.vote_average,
          genres: [],
        }));
      } else {
        const result: JikanSearchResponse = query
          ? await searchAnime(query)
          : await getTopAnime();

        return result.data.map((anime): MediaItem => ({
          id: anime.mal_id,
          mediaType: "ANIME",
          title: anime.title,
          posterUrl: anime.images.jpg.image_url,
          year: anime.year?.toString() ?? "-",
          status: anime.status,
          rating: anime.score ?? 0,
          genres: anime.genres.map((g) => g.name),
        }));
      }
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="flex justify-between w-full px-6 mb-6">
        <Link href="/" className="text-xl font-bold text-black self-center">
          TrackerList
        </Link>

        <div className="flex justify-end self-center">
          <Link href="/login" className="ml-4 bg-white text-black px-4 py-2 rounded-full font-medium hover:bg-gray-100 transition-colors border border-gray-500">
            Login
          </Link>
          <Link href="/register" className="ml-4 bg-blue-500 text-white px-4 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors border border-gray-500">
            Sign Up
          </Link>
        </div>
      </div>

      <div className="flex flex-col items-center">
        <SearchBar onSearch={setQuery} onTabChange={setTab} />
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        {isLoading && (
          <p className="text-center text-gray-500">Loading...</p>
        )}

        {isError && (
          <p className="text-center text-red-500">
            Failed to load data. Please try again.
          </p>
        )}

        {!isLoading && !isError && data?.length === 0 && (
          <p className="text-center text-gray-500">No results found.</p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
          {data?.map((item, index) => (
            <MovieCard
              key={`${item.mediaType}-${item.id}`}
              id={item.id}
              mediaType={item.mediaType}
              title={item.title}
              posterUrl={item.posterUrl}
              year={item.year}
              status={item.status}
              rating={item.rating}
              priority={index < 4}
            />
          ))}
        </div>
      </div>
    </div >
  );
}