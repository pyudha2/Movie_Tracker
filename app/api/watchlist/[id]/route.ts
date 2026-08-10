import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function PATCH(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const item = await prisma.watchlist.findUnique({ where: { id } });

        if (!item || item.userId !== session.user.id) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        const { status, rating, review } = await req.json();

        const updated = await prisma.watchlist.update({
            where: { id },
            data: {
                ...(status && { status }),
                ...(rating !== undefined && { rating }),
                ...(review !== undefined && { review }),
            },
        });

        return NextResponse.json(updated, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to update watchlist" },
            { status: 500 }
        );
    }
}

export async function DELETE(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;

    try {
        const item = await prisma.watchlist.findUnique({ where: { id } });

        if (!item || item.userId !== session.user.id) {
            return NextResponse.json({ message: "Not found" }, { status: 404 });
        }

        await prisma.watchlist.delete({ where: { id } });

        return NextResponse.json(
            { message: "Removed from watchlist" },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to remove from watchlist" },
            { status: 500 }
        );
    }
}