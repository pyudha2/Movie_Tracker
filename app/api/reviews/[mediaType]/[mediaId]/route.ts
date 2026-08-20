import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ mediaType: string; mediaId: string }> }
) {
    const { mediaType, mediaId } = await params;

    const normalizedType = mediaType.toUpperCase();
    if (normalizedType !== "MOVIE" && normalizedType !== "ANIME") {
        return NextResponse.json({ message: "Invalid mediaType" }, { status: 400 });
    }

    try {
        const reviews = await prisma.watchlist.findMany({
            where: {
                mediaId: Number(mediaId),
                mediaType: normalizedType,
                review: { not: null },
            },
            select: {
                id: true,
                rating: true,
                review: true,
                createdAt: true,
                updatedAt: true,
                userId: true,
                user: {
                    select: { name: true, image: true },
                },
            },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch reviews" }, { status: 500 });
    }
}