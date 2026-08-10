import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const watchlist = await prisma.watchlist.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: "desc" },
        });

        return NextResponse.json(watchlist, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch watchlist" },
            { status: 500 }
        );
    }
}

export async function POST(req: Request) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { mediaId, mediaType, title, posterUrl } = await req.json();

        if (!mediaId || !mediaType || !title) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        const existing = await prisma.watchlist.findUnique({
            where: {
                userId_mediaId_mediaType: {
                    userId: session.user.id,
                    mediaId,
                    mediaType,
                },
            },
        });

        if (existing) {
            return NextResponse.json(
                { message: "Already in watchlist" },
                { status: 400 }
            );
        }

        const item = await prisma.watchlist.create({
            data: {
                userId: session.user.id,
                mediaId,
                mediaType,
                title,
                posterUrl,
            },
        });

        return NextResponse.json(item, { status: 201 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to add to watchlist" },
            { status: 500 }
        );
    }
}