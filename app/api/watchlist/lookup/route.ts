import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const mediaId = Number(searchParams.get("mediaId"));
    const mediaType = searchParams.get("mediaType");

    if (!mediaId || (mediaType !== "MOVIE" && mediaType !== "ANIME")) {
        return NextResponse.json({ message: "Invalid params" }, { status: 400 });
    }

    try {
        const item = await prisma.watchlist.findUnique({
            where: {
                userId_mediaId_mediaType: {
                    userId: session.user.id,
                    mediaId,
                    mediaType,
                },
            },
        });

        return NextResponse.json({ item: item ?? null }, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to lookup item" }, { status: 500 });
    }
}