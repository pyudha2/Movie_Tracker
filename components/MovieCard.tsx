import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { memo } from "react";

interface MovieCardProps {
    id: number;
    mediaType: "MOVIE" | "ANIME";
    title: string;
    posterUrl: string;
    year: string;
    status: string;
    rating: number;
    genres: string[];
    priority?: boolean;
}

function MovieCard({
    id,
    mediaType,
    title,
    posterUrl,
    year,
    status,
    rating,
    genres,
    priority = false,
}: MovieCardProps) {
    const stars = Math.round(rating / 2);

    return (
        <Link href={`/detail/${id}`} className="block">
            <div className="border-4 border-gray-400 rounded-xl bg-white h-100 w-80 pt-2 px-2">
                <div className="rounded-xl bg-blue-400 w-45 pb-2 flex flex-col items-center mx-auto">
                    <div className="relative rounded-xl overflow-hidden h-55 w-45">
                        <Image
                            src={posterUrl}
                            alt={`${title} poster`}
                            fill
                            sizes="180px"
                            className="object-cover"
                            priority={priority}
                        />
                    </div>
                    <div className="text-white text-sm font-medium mt-1">
                        {mediaType === "MOVIE" ? "Movie" : "Anime"}
                    </div>
                </div>

                <div>
                    <h3 className="font-bold text-black text-center mt-1 line-clamp-1">
                        {title}
                    </h3>
                    <div className="flex flex-wrap gap-2 my-2 align-center justify-center">
                        {genres.slice(0, 3).map((genre) => (
                            <span
                                key={genre}
                                className="bg-white text-black text-xs px-3 py-1 rounded-full border border-gray-400"
                            >
                                {genre}
                            </span>
                        ))}
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <div className="text-black">
                            <p>{year}</p>
                            <p>{status}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-black text-2xl font-bold leading-none">
                                {rating.toFixed(1)}
                            </p>
                            <div
                                className="flex gap-0.5 mt-1 justify-end"
                                aria-label={`Rating ${stars} out of 5 stars`}
                            >
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <Star
                                        key={i}
                                        size={12}
                                        className={
                                            i < stars
                                                ? "fill-yellow-400 text-gray-400"
                                                : "text-black"
                                        }
                                    />
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Link>
    );
}

export default memo(MovieCard);