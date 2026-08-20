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
        const reviews = await prisma.watchlist.findMany({
            where: {
                userId: session.user.id,
                review: { not: null },
            },
            orderBy: { updatedAt: "desc" },
        });

        return NextResponse.json(reviews, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Failed to fetch your reviews" }, { status: 500 });
    }
}