"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import WatchlistButton from "@/components/WatchlistButton";

interface MovieDetail {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    runtime: number;
    tagline: string;
    genres: { id: number; name: string }[];
}

export default function MovieDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, isError } = useQuery<MovieDetail>({
        queryKey: ["movie-detail", id],
        queryFn: async () => {
            const res = await fetch(`/api/movies/${id}`);
            return res.json();
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (isError || !data) {
        return <p className="text-center mt-10 text-red-500">Failed to load movie detail.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-5">
            {data.backdrop_path && (
                <div className="relative h-80 w-full">
                    <Image
                        src={`https://image.tmdb.org/t/p/original${data.backdrop_path}`}
                        alt={data.title}
                        fill
                        className="object-cover"
                    />
                    <div className="absolute inset-0 bg-black/40" />
                </div>
            )}

            <div className="max-w-4xl mx-auto px-4 -mt-20 relative">
                <div className="flex gap-6">
                    <div className="relative w-40 h-60 rounded-xl overflow-hidden shadow-lg flex shrink-0">
                        <Image
                            src={
                                data.poster_path
                                    ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                                    : "/placeholder.png"
                            }
                            alt={data.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div className="pt-24">
                        <h1 className="text-2xl font-bold text-black">{data.title}</h1>
                        {data.tagline && (
                            <p className="text-gray-500 italic mt-1">{data.tagline}</p>
                        )}

                        <div className="flex items-center gap-2 mt-3">
                            <Star size={18} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-black">
                                {data.vote_average.toFixed(1)}
                            </span>
                            <span className="text-gray-500">
                                • {data.release_date?.slice(0, 4)} • {data.runtime} min
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                    {data.genres.map((genre) => (
                        <span
                            key={genre.id}
                            className="bg-white text-black text-sm px-3 py-1 rounded-full border border-gray-300"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>

                <div className="mt-6">
                    <h2 className="font-bold text-lg text-black">Synopsis</h2>
                    <p className="text-gray-700 mt-2 leading-relaxed">{data.overview}</p>
                </div>

                <WatchlistButton
                    mediaId={data.id}
                    mediaType="MOVIE"
                    title={data.title}
                    posterUrl={
                        data.poster_path
                            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
                            : "/placeholder.png"
                    }
                />
            </div>
        </div>
    );
}