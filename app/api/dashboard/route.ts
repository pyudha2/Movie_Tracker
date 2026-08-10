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
        });

        const totalItems = watchlist.length;
        const totalMovies = watchlist.filter((w) => w.mediaType === "MOVIE").length;
        const totalAnime = watchlist.filter((w) => w.mediaType === "ANIME").length;

        const completed = watchlist.filter((w) => w.status === "COMPLETED");
        const ratedItems = completed.filter((w) => w.rating !== null);
        const averageRating =
            ratedItems.length > 0
                ? ratedItems.reduce((sum, w) => sum + (w.rating ?? 0), 0) / ratedItems.length
                : 0;

        const statusBreakdown = {
            PLAN_TO_WATCH: watchlist.filter((w) => w.status === "PLAN_TO_WATCH").length,
            WATCHING: watchlist.filter((w) => w.status === "WATCHING").length,
            COMPLETED: completed.length,
            DROPPED: watchlist.filter((w) => w.status === "DROPPED").length,
        };

        return NextResponse.json(
            {
                totalItems,
                totalMovies,
                totalAnime,
                averageRating: Number(averageRating.toFixed(1)),
                statusBreakdown,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch dashboard data" },
            { status: 500 }
        );
    }
}