"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import Link from "next/link";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import RatingStars from "@/components/RatingStars";

interface WatchlistItem {
    id: string;
    mediaId: number;
    mediaType: "MOVIE" | "ANIME";
    title: string;
    posterUrl: string | null;
    status: "PLAN_TO_WATCH" | "WATCHING" | "COMPLETED" | "DROPPED";
    rating: number | null;
    review: string | null;
}

const STATUS_LABELS: Record<WatchlistItem["status"], string> = {
    PLAN_TO_WATCH: "Plan to Watch",
    WATCHING: "Watching",
    COMPLETED: "Completed",
    DROPPED: "Dropped",
};

export default function WatchlistPage() {
    const queryClient = useQueryClient();

    const { data, isLoading, isError } = useQuery<WatchlistItem[]>({
        queryKey: ["watchlist"],
        queryFn: async () => {
            const res = await fetch("/api/watchlist");
            if (!res.ok) throw new Error("Failed to fetch watchlist");
            return res.json();
        },
    });

    const updateMutation = useMutation({
        mutationFn: async ({
            id,
            status,
            rating,
        }: {
            id: string;
            status?: WatchlistItem["status"];
            rating?: number;
        }) => {
            const res = await fetch(`/api/watchlist/${id}`, {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ status, rating }),
            });
            if (!res.ok) throw new Error("Failed to update");
            return res.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        },
        onError: () => {
            toast.error("Failed to update item");
        },
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: string) => {
            const res = await fetch(`/api/watchlist/${id}`, { method: "DELETE" });
            if (!res.ok) throw new Error("Failed to delete");
            return res.json();
        },
        onSuccess: () => {
            toast.success("Removed from watchlist");
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        },
        onError: () => {
            toast.error("Failed to remove item");
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (isError) {
        return (
            <p className="text-center mt-10 text-red-500">
                Failed to load watchlist.
            </p>
        );
    }

    const groupedByStatus = (Object.keys(STATUS_LABELS) as WatchlistItem["status"][]).map(
        (status) => ({
            status,
            items: data?.filter((item) => item.status === status) ?? [],
        })
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-black mb-6">My Watchlist</h1>

                {data?.length === 0 && (
                    <p className="text-center text-gray-500 mt-10">
                        Your watchlist is empty. Start adding movies or anime!
                    </p>
                )}

                {groupedByStatus.map(
                    ({ status, items }) =>
                        items.length > 0 && (
                            <div key={status} className="mb-8">
                                <h2 className="text-lg font-bold text-black mb-3">
                                    {STATUS_LABELS[status]} ({items.length})
                                </h2>

                                <div className="space-y-3">
                                    {items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="bg-white rounded-xl border border-gray-200 p-4 flex gap-4"
                                        >
                                            <Link
                                                href={`/detail/${item.mediaType.toLowerCase()}/${item.mediaId}`}
                                                className="relative w-16 h-24 rounded-lg overflow-hidden flex shrink-0"
                                            >
                                                <Image
                                                    src={item.posterUrl ?? "/placeholder.png"}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </Link>

                                            <div className="flex-1">
                                                <Link
                                                    href={`/detail/${item.mediaType.toLowerCase()}/${item.mediaId}`}
                                                >
                                                    <h3 className="font-bold text-black hover:underline">
                                                        {item.title}
                                                    </h3>
                                                </Link>
                                                <p className="text-gray-500 text-sm">
                                                    {item.mediaType === "MOVIE" ? "Movie" : "Anime"}
                                                </p>

                                                <select
                                                    value={item.status}
                                                    onChange={(e) =>
                                                        updateMutation.mutate({
                                                            id: item.id,
                                                            status: e.target.value as WatchlistItem["status"],
                                                        })
                                                    }
                                                    className="mt-2 text-sm border border-gray-300 rounded-lg px-2 py-1 text-black"
                                                >
                                                    {Object.entries(STATUS_LABELS).map(([value, label]) => (
                                                        <option key={value} value={value}>
                                                            {label}
                                                        </option>
                                                    ))}
                                                </select>

                                                {status === "COMPLETED" && (
                                                    <div className="mt-2">
                                                        <RatingStars
                                                            initialRating={item.rating ?? 0}
                                                            size={18}
                                                            onRate={(rating) =>
                                                                updateMutation.mutate({ id: item.id, rating })
                                                            }
                                                        />
                                                    </div>
                                                )}
                                            </div>

                                            <button
                                                onClick={() => deleteMutation.mutate(item.id)}
                                                className="text-gray-400 hover:text-red-500 transition-colors self-start"
                                            >
                                                <Trash2 size={20} />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )
                )}
            </div>
        </div>
    );
}