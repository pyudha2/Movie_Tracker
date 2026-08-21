"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import SearchBar from "@/components/SearchBar";
import MovieCard from "@/components/MovieCard";
import CategoryCarousel from "@/components/CategoryCarousel";
import MonthSelector from "@/components/MonthSelector";
import { searchAnime, getTopAnime } from "@/lib/jikan";

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

const MIN_ANIME_QUERY_LENGTH = 3;

const mapTMDBMovie = (movie: TMDBMovieResult): MediaItem => ({
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
});

const mapJikanAnime = (anime: JikanAnimeResult): MediaItem => ({
  id: anime.mal_id,
  mediaType: "ANIME",
  title: anime.title,
  posterUrl: anime.images.jpg.image_url,
  year: anime.year?.toString() ?? "-",
  status: anime.status,
  rating: anime.score ?? 0,
  genres: anime.genres.map((g) => g.name),
});

export default function Home() {
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"MOVIE" | "ANIME">("MOVIE");

  const now = new Date();
  const [upcomingYear, setUpcomingYear] = useState(now.getFullYear());
  const [upcomingMonth, setUpcomingMonth] = useState(now.getMonth() + 1);

  const hasSearched = query.trim().length > 0;

  const isQueryTooShort =
    tab === "ANIME" && hasSearched && query.length < MIN_ANIME_QUERY_LENGTH;

  const { data: searchData, isLoading: searchLoading, isError: searchError } = useQuery<MediaItem[]>({
    queryKey: ["media", tab, query],
    enabled: hasSearched && !isQueryTooShort,
    retry: 1,
    queryFn: async ({ signal }) => {
      if (tab === "MOVIE") {
        const res = await fetch(`/api/movies?query=${query}`, { signal });
        const result: TMDBSearchResponse = await res.json();
        return result.results.map(mapTMDBMovie);
      } else {
        const result: JikanSearchResponse = await searchAnime(query, 1, signal);
        return result.data.map(mapJikanAnime);
      }
    },
  });

  const { data: nowPlaying, isLoading: nowPlayingLoading } = useQuery<MediaItem[]>({
    queryKey: ["movies", "now-playing"],
    enabled: tab === "MOVIE" && !hasSearched,
    retry: 1,
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/movies/now-playing", { signal });
      const result: TMDBSearchResponse = await res.json();
      return result.results.map(mapTMDBMovie);
    },
  });

  const { data: upcomingMovies, isLoading: upcomingMoviesLoading } = useQuery<MediaItem[]>({
    queryKey: ["movies", "upcoming", upcomingYear, upcomingMonth],
    enabled: tab === "MOVIE" && !hasSearched,
    retry: 1,
    queryFn: async ({ signal }) => {
      const res = await fetch(
        `/api/movies/upcoming?year=${upcomingYear}&month=${upcomingMonth}`,
        { signal }
      );
      const result: TMDBSearchResponse = await res.json();
      return result.results.map(mapTMDBMovie);
    },
  });

  const { data: popularMovies, isLoading: popularMoviesLoading } = useQuery<MediaItem[]>({
    queryKey: ["movies", "popular"],
    enabled: tab === "MOVIE" && !hasSearched,
    retry: 1,
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/movies", { signal });
      const result: TMDBSearchResponse = await res.json();
      return result.results.map(mapTMDBMovie);
    },
  });

  const { data: recommendedMovies, isLoading: recommendedMoviesLoading } = useQuery<MediaItem[]>({
    queryKey: ["movies", "top-rated"],
    enabled: tab === "MOVIE" && !hasSearched,
    retry: 1,
    queryFn: async ({ signal }) => {
      const res = await fetch("/api/movies/top-rated", { signal });
      const result: TMDBSearchResponse = await res.json();
      return result.results.map(mapTMDBMovie);
    },
  });

  const { data: popularAnime, isLoading: popularAnimeLoading } = useQuery<MediaItem[]>({
    queryKey: ["anime", "popular"],
    enabled: tab === "ANIME" && !hasSearched,
    retry: 1,
    queryFn: async ({ signal }) => {
      const result: JikanSearchResponse = await getTopAnime(1, signal);
      return result.data.map(mapJikanAnime);
    },
  });

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="flex flex-col items-center">
        <SearchBar
          onSearch={setQuery}
          onTabChange={(newTab) => {
            setTab(newTab);
            setQuery("");
          }}
        />
      </div>

      <div className="max-w-6xl mx-auto mt-8">
        {hasSearched ? (
          <>
            {isQueryTooShort && (
              <p className="text-center text-gray-500">Ketik minimal 3 huruf buat search anime</p>
            )}

            {!isQueryTooShort && searchLoading && (
              <p className="text-center text-gray-500">Loading...</p>
            )}

            {!isQueryTooShort && searchError && (
              <p className="text-center text-red-500">
                Failed to load data. Please try again.
              </p>
            )}

            {!isQueryTooShort && !searchLoading && !searchError && searchData?.length === 0 && (
              <p className="text-center text-gray-500">No results found.</p>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
              {!isQueryTooShort && searchData?.map((item, index) => (
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
          </>
        ) : tab === "MOVIE" ? (
          <>
            <CategoryCarousel title="In Theater" items={nowPlaying ?? []} isLoading={nowPlayingLoading} />
            <CategoryCarousel
              title="Upcoming"
              items={upcomingMovies ?? []}
              isLoading={upcomingMoviesLoading}
              headerAction={
                <MonthSelector
                  year={upcomingYear}
                  month={upcomingMonth}
                  onChange={(y, m) => {
                    setUpcomingYear(y);
                    setUpcomingMonth(m);
                  }}
                />
              }
            />
            <CategoryCarousel title="Popular Movie" items={popularMovies ?? []} isLoading={popularMoviesLoading} />
            <CategoryCarousel title="Rekomendasi Movie" items={recommendedMovies ?? []} isLoading={recommendedMoviesLoading} />
          </>
        ) : (
          <>
            <CategoryCarousel title="Popular Anime" items={popularAnime ?? []} isLoading={popularAnimeLoading} />
          </>
        )}
      </div>
    </div>
  );
}