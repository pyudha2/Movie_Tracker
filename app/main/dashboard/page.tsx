"use client";

import { useQuery } from "@tanstack/react-query";
import { Film, Tv, Star, ListChecks } from "lucide-react";

interface DashboardData {
    totalItems: number;
    totalMovies: number;
    totalAnime: number;
    averageRating: number;
    statusBreakdown: {
        PLAN_TO_WATCH: number;
        WATCHING: number;
        COMPLETED: number;
        DROPPED: number;
    };
}

const STATUS_LABELS: Record<keyof DashboardData["statusBreakdown"], string> = {
    PLAN_TO_WATCH: "Plan to Watch",
    WATCHING: "Watching",
    COMPLETED: "Completed",
    DROPPED: "Dropped",
};

export default function DashboardPage() {
    const { data, isLoading, isError } = useQuery<DashboardData>({
        queryKey: ["dashboard"],
        queryFn: async () => {
            const res = await fetch("/api/dashboard");
            if (!res.ok) throw new Error("Failed to fetch dashboard");
            return res.json();
        },
    });

    if (isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (isError || !data) {
        return (
            <p className="text-center mt-10 text-red-500">
                Failed to load dashboard.
            </p>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-2xl font-bold text-black mb-6">Dashboard</h1>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <ListChecks size={20} className="text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-black">{data.totalItems}</p>
                        <p className="text-gray-500 text-sm">Total Tracked</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <Film size={20} className="text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-black">{data.totalMovies}</p>
                        <p className="text-gray-500 text-sm">Movies</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <Tv size={20} className="text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-black">{data.totalAnime}</p>
                        <p className="text-gray-500 text-sm">Anime</p>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 p-4">
                        <Star size={20} className="text-yellow-400 mb-2 fill-yellow-400" />
                        <p className="text-2xl font-bold text-black">
                            {data.averageRating > 0 ? data.averageRating : "-"}
                        </p>
                        <p className="text-gray-500 text-sm">Avg Rating</p>
                    </div>
                </div>

                <div className="bg-white rounded-xl border border-gray-200 p-6">
                    <h2 className="font-bold text-black mb-4">Status Breakdown</h2>

                    <div className="space-y-3">
                        {(Object.keys(STATUS_LABELS) as Array<keyof DashboardData["statusBreakdown"]>).map(
                            (key) => {
                                const count = data.statusBreakdown[key];
                                const percentage =
                                    data.totalItems > 0 ? (count / data.totalItems) * 100 : 0;

                                return (
                                    <div key={key}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span className="text-black">{STATUS_LABELS[key]}</span>
                                            <span className="text-gray-500">{count}</span>
                                        </div>
                                        <div className="w-full bg-gray-100 rounded-full h-2">
                                            <div
                                                className="bg-blue-600 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            />
                                        </div>
                                    </div>
                                );
                            }
                        )}
                    </div>
                </div>

                {data.totalItems === 0 && (
                    <p className="text-center text-gray-500 mt-8">
                        No data yet. Start adding movies or anime to your watchlist!
                    </p>
                )}
            </div>
        </div>
    );
}