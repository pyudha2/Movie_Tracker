import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

interface ReviewCardProps {
    rating: number | null;
    review: string;
    createdAt: string;
    updatedAt: string;
    reviewerName?: string;
    reviewerImage?: string | null;
    isOwnReview?: boolean;
    mediaTitle?: string;
    mediaPosterUrl?: string | null;
    mediaHref?: string;
}

export default function ReviewCard({
    rating,
    review,
    createdAt,
    updatedAt,
    reviewerName,
    reviewerImage,
    isOwnReview,
    mediaTitle,
    mediaPosterUrl,
    mediaHref,
}: ReviewCardProps) {
    const isEdited =
        new Date(updatedAt).getTime() - new Date(createdAt).getTime() > 60000;

    return (
        <div className="border border-gray-300 rounded-xl p-4 bg-white">
            <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                    {reviewerName && (
                        <div className="w-9 h-9 rounded-full overflow-hidden bg-gray-200 shrink-0">
                            {reviewerImage ? (
                                <Image
                                    src={reviewerImage}
                                    alt={reviewerName}
                                    width={36}
                                    height={36}
                                    className="object-cover w-full h-full"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-sm font-bold text-gray-500">
                                    {reviewerName.charAt(0).toUpperCase()}
                                </div>
                            )}
                        </div>
                    )}

                    {mediaTitle && mediaHref && (
                        <Link href={mediaHref} className="flex items-center gap-3">
                            {mediaPosterUrl && (
                                <div className="relative w-9 h-12 rounded overflow-hidden shrink-0">
                                    <Image src={mediaPosterUrl} alt={mediaTitle} fill className="object-cover" />
                                </div>
                            )}
                            <span className="font-medium text-black hover:underline">{mediaTitle}</span>
                        </Link>
                    )}

                    <div>
                        {reviewerName && (
                            <p className="font-medium text-black text-sm">
                                {reviewerName} {isOwnReview && <span className="text-gray-400">(Kamu)</span>}
                            </p>
                        )}
                        <p className="text-gray-400 text-xs">
                            {new Date(createdAt).toLocaleDateString("id-ID", {
                                day: "numeric",
                                month: "short",
                                year: "numeric",
                            })}
                            {isEdited && " • diedit"}
                        </p>
                    </div>
                </div>

                {rating !== null && (
                    <div className="flex items-center gap-1 shrink-0">
                        <Star size={14} className="fill-yellow-400 text-yellow-400" />
                        <span className="text-sm font-bold text-black">{rating}</span>
                    </div>
                )}
            </div>

            <p className="text-gray-700 text-sm mt-3 leading-relaxed whitespace-pre-wrap">
                {review}
            </p>
        </div>
    );
}