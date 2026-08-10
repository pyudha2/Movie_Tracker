"use client";

import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import Image from "next/image";
import { Star } from "lucide-react";
import { getAnimeDetail } from "@/lib/jikan";
import WatchlistButton from "@/components/WatchlistButton";

export default function AnimeDetailPage() {
    const params = useParams();
    const id = params.id as string;

    const { data, isLoading, isError } = useQuery({
        queryKey: ["anime-detail", id],
        queryFn: () => getAnimeDetail(Number(id)),
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (isError || !data) {
        return <p className="text-center mt-10 text-red-500">Failed to load anime detail.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-4xl mx-auto px-4 pt-8">
                <div className="flex gap-6">
                    <div className="relative w-40 h-60 rounded-xl overflow-hidden shadow-lg flex shrink-0">
                        <Image
                            src={data.images.jpg.large_image_url}
                            alt={data.title}
                            fill
                            className="object-cover"
                        />
                    </div>

                    <div>
                        <h1 className="text-2xl font-bold text-black">{data.title}</h1>

                        <div className="flex items-center gap-2 mt-3">
                            <Star size={18} className="fill-yellow-400 text-yellow-400" />
                            <span className="font-bold text-black">
                                {data.score ?? "-"}
                            </span>
                            <span className="text-gray-500">
                                • {data.episodes ?? "?"} episodes • {data.status}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-6">
                    {data.genres.map((genre) => (
                        <span
                            key={genre.mal_id}
                            className="bg-white text-black text-sm px-3 py-1 rounded-full border border-gray-300"
                        >
                            {genre.name}
                        </span>
                    ))}
                </div>

                <div className="mt-6">
                    <h2 className="font-bold text-lg text-black">Synopsis</h2>
                    <p className="text-gray-700 mt-2 leading-relaxed">{data.synopsis}</p>
                </div>

                <WatchlistButton
                    mediaId={data.mal_id}
                    mediaType="ANIME"
                    title={data.title}
                    posterUrl={
                        data.images.jpg.large_image_url
                            ? data.images.jpg.large_image_url
                            : "/placeholder.png"
                    }
                />
            </div>
        </div>
    );
}