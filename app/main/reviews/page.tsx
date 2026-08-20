"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import ReviewCard from "@/components/ReviewCard";

interface MyReview {
    id: string;
    mediaId: number;
    mediaType: "MOVIE" | "ANIME";
    title: string;
    posterUrl: string | null;
    rating: number | null;
    review: string;
    createdAt: string;
    updatedAt: string;
}

export default function MyReviewsPage() {
    const { data: session, status } = useSession();

    const { data: reviews, isLoading } = useQuery<MyReview[]>({
        queryKey: ["my-reviews"],
        queryFn: async () => {
            const res = await fetch("/api/reviews/my");
            return res.json();
        },
        enabled: !!session,
    });

    if (status === "loading" || isLoading) {
        return <p className="text-center mt-10">Loading...</p>;
    }

    if (!session) {
        return <p className="text-center mt-10 text-gray-500">Login dulu buat liat review lo.</p>;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-3xl mx-auto">
                <h1 className="text-2xl font-bold text-black mb-6">My Reviews</h1>

                {reviews?.length === 0 && (
                    <p className="text-gray-500">Lo belum nulis review apapun.</p>
                )}

                <div className="space-y-3">
                    {reviews?.map((r) => (
                        <ReviewCard
                            key={r.id}
                            rating={r.rating}
                            review={r.review}
                            createdAt={r.createdAt}
                            updatedAt={r.updatedAt}
                            mediaTitle={r.title}
                            mediaPosterUrl={r.posterUrl}
                            mediaHref={`/main/detail/${r.mediaType.toLowerCase()}/${r.mediaId}`}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}