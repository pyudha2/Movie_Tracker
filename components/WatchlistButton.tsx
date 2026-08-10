"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Bookmark } from "lucide-react";
import toast from "react-hot-toast";

interface WatchlistButtonProps {
    mediaId: number;
    mediaType: "MOVIE" | "ANIME";
    title: string;
    posterUrl: string;
}

export default function WatchlistButton({
    mediaId,
    mediaType,
    title,
    posterUrl,
}: WatchlistButtonProps) {
    const { data: session } = useSession();
    const router = useRouter();
    const queryClient = useQueryClient();
    const [isAdded, setIsAdded] = useState(false);

    const mutation = useMutation({
        mutationFn: async () => {
            const res = await fetch("/api/watchlist", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ mediaId, mediaType, title, posterUrl }),
            });

            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.message);
            }

            return res.json();
        },
        onSuccess: () => {
            setIsAdded(true);
            toast.success("Added to watchlist");
            queryClient.invalidateQueries({ queryKey: ["watchlist"] });
        },
        onError: (error: Error) => {
            toast.error(error.message || "Something went wrong");
        },
    });

    const handleClick = () => {
        if (!session) {
            router.push("/login");
            return;
        }

        mutation.mutate();
    };

    return (
        <button
            onClick={handleClick}
            disabled={mutation.isPending || isAdded}
            className="mt-6 bg-blue-600 text-white px-6 py-3 rounded-full font-medium hover:bg-blue-700 transition-colors disabled:opacity-60 flex items-center gap-2"
        >
            <Bookmark size={18} className={isAdded ? "fill-white" : ""} />
            {mutation.isPending
                ? "Adding..."
                : isAdded
                    ? "Added to Watchlist"
                    : "Add to Watchlist"}
        </button>
    );
}