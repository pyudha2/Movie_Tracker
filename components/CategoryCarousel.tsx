"use client";

import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { ChevronLeft, ChevronRight } from "lucide-react";
import MovieCard from "./MovieCard";

interface CarouselItem {
    id: number;
    mediaType: "MOVIE" | "ANIME";
    title: string;
    posterUrl: string;
    year: string;
    status: string;
    rating: number;
}

interface CategoryCarouselProps {
    title: string;
    items: CarouselItem[];
    isLoading?: boolean;
    headerAction?: React.ReactNode;
}

export default function CategoryCarousel({
    title,
    items,
    isLoading,
    headerAction,
}: CategoryCarouselProps) {
    const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true, align: "start" }, [
        Autoplay({ delay: 4000, stopOnInteraction: false }),
    ]);

    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
    const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

    const onSelect = useCallback(() => {
        if (!emblaApi) return;
        setCanScrollPrev(emblaApi.canScrollPrev());
        setCanScrollNext(emblaApi.canScrollNext());
    }, [emblaApi]);

    useEffect(() => {
        if (!emblaApi) return;
        emblaApi.on("select", onSelect);
        emblaApi.on("reInit", onSelect);
        emblaApi.on("init", onSelect);

        return () => {
            emblaApi.off("select", onSelect);
            emblaApi.off("reInit", onSelect);
            emblaApi.off("init", onSelect);
        };
    }, [emblaApi, onSelect]);

    return (
        <div className="mb-10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-black">{title}</h2>
                {headerAction}
            </div>

            {isLoading && (
                <p className="text-gray-500 text-sm">Memuat...</p>
            )}

            {!isLoading && items.length === 0 && (
                <p className="text-gray-500 text-sm">Belum ada data untuk kategori ini.</p>
            )}

            {!isLoading && items.length > 0 && (
                <div className="relative">
                    <div className="overflow-hidden" ref={emblaRef}>
                        <div className="flex gap-4">
                            {items.map((item) => (
                                <div
                                    key={`${item.mediaType}-${item.id}`}
                                    className="shrink-0 basis-1/2 sm:basis-1/3 md:basis-1/4 lg:basis-1/5"
                                >
                                    <MovieCard
                                        id={item.id}
                                        mediaType={item.mediaType}
                                        title={item.title}
                                        posterUrl={item.posterUrl}
                                        year={item.year}
                                        status={item.status}
                                        rating={item.rating}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={scrollPrev}
                        disabled={!canScrollPrev}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-3 bg-white border-2 border-black rounded-full w-9 h-9 flex items-center justify-center text-black disabled:opacity-30 hover:bg-gray-100 z-10"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    <button
                        onClick={scrollNext}
                        disabled={!canScrollNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-3 bg-white border-2 border-black rounded-full w-9 h-9 flex items-center justify-center text-black disabled:opacity-30 hover:bg-gray-100 z-10"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>
            )}
        </div>
    );
}