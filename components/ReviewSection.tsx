"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import toast from "react-hot-toast";
import ReviewCard from "./ReviewCard";

interface ReviewSectionProps {
    mediaId: number;
    mediaType: "MOVIE" | "ANIME";
}

interface PublicReview {
    id: string;
    rating: number | null;
    review: string;
    createdAt: string;
    updatedAt: string;
    userId: string;
    user: { name: string; image: string | null };
}

interface WatchlistItem {
    id: string;
    review: string | null;
    rating: number | null;
    createdAt: string;
    updatedAt: string;
}

const MAX_LENGTH = 1000;

function ReviewForm({
    itemId,
    initialReview,
    mediaId,
    mediaType,
}: {
    itemId: string;
    initialReview: string;
    mediaId: number;
    mediaType: "MOVIE" | "ANIME";
}) {
    const queryClient = useQueryClient();
    const [reviewText, setReviewText] = useState(initialReview);
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        setIsSaving(true);

        try {
            await axios.patch(`/api/watchlist/${itemId}`, {
                review: reviewText,
            });

            toast.success("Review berhasil disimpan");
            queryClient.invalidateQueries({ queryKey: ["reviews", mediaType, mediaId] });
            queryClient.invalidateQueries({ queryKey: ["watchlist-lookup", mediaType, mediaId] });
        } catch (error) {
            toast.error("Gagal menyimpan review");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-2">
            <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value.slice(0, MAX_LENGTH))}
                placeholder="Tulis review lo di sini..."
                rows={4}
                className="w-full text-black border-2 border-black p-3 rounded-xl resize-none"
            />
            <div className="flex items-center justify-between">
                <span className="text-gray-400 text-xs">
                    {reviewText.length}/{MAX_LENGTH}
                </span>
                <button
                    type="submit"
                    disabled={isSaving}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm py-2 px-4 rounded-xl disabled:opacity-50"
                >
                    {isSaving ? "Menyimpan..." : "Simpan Review"}
                </button>
            </div>
        </form>
    );
}

export default function ReviewSection({ mediaId, mediaType }: ReviewSectionProps) {
    const { data: session } = useSession();

    const { data: reviews, isLoading: reviewsLoading } = useQuery<PublicReview[]>({
        queryKey: ["reviews", mediaType, mediaId],
        queryFn: async () => {
            const res = await axios.get(`/api/reviews/${mediaType}/${mediaId}`);
            return res.data;
        },
    });

    const { data: ownItem } = useQuery<{ item: WatchlistItem | null }>({
        queryKey: ["watchlist-lookup", mediaType, mediaId],
        queryFn: async () => {
            const res = await axios.get("/api/watchlist/lookup", {
                params: { mediaId, mediaType },
            });
            return res.data;
        },
        enabled: !!session,
    });

    return (
        <div className="mt-8">
            <h2 className="font-bold text-lg text-black mb-4">Reviews</h2>

            {session && (
                <div className="mb-6">
                    {ownItem?.item ? (
                        <ReviewForm
                            key={ownItem.item.id}
                            itemId={ownItem.item.id}
                            initialReview={ownItem.item.review ?? ""}
                            mediaId={mediaId}
                            mediaType={mediaType}
                        />
                    ) : (
                        <p className="text-gray-500 text-sm border border-gray-300 rounded-xl p-4">
                            Tambahin ke watchlist dulu buat bisa kasih review.
                        </p>
                    )}
                </div>
            )}

            {reviewsLoading && <p className="text-gray-500 text-sm">Memuat review...</p>}

            {!reviewsLoading && reviews?.length === 0 && (
                <p className="text-gray-500 text-sm">Belum ada review buat judul ini.</p>
            )}

            <div className="space-y-3">
                {reviews?.map((r) => (
                    <ReviewCard
                        key={r.id}
                        rating={r.rating}
                        review={r.review}
                        createdAt={r.createdAt}
                        updatedAt={r.updatedAt}
                        reviewerName={r.user.name}
                        reviewerImage={r.user.image}
                        isOwnReview={r.userId === session?.user?.id}
                    />
                ))}
            </div>
        </div>
    );
}