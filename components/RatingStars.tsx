"use client";

import { useState } from "react";
import { Star } from "lucide-react";

interface RatingStarsProps {
    initialRating?: number;
    onRate: (rating: number) => void;
    size?: number;
}

export default function RatingStars({
    initialRating = 0,
    onRate,
    size = 24,
}: RatingStarsProps) {
    const [rating, setRating] = useState(initialRating);
    const [hoverRating, setHoverRating] = useState(0);

    const handleClick = (value: number) => {
        setRating(value);
        onRate(value);
    };

    return (
        <div className="flex gap-1">
            {Array.from({ length: 5 }).map((_, i) => {
                const value = i + 1;
                const isFilled = value <= (hoverRating || rating);

                return (
                    <button
                        key={value}
                        type="button"
                        onClick={() => handleClick(value)}
                        onMouseEnter={() => setHoverRating(value)}
                        onMouseLeave={() => setHoverRating(0)}
                        className="transition-transform hover:scale-110"
                    >
                        <Star
                            size={size}
                            className={
                                isFilled
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-gray-300"
                            }
                        />
                    </button>
                );
            })}
        </div>
    );
}