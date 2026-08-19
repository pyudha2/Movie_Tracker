import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function GET() {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
            select: {
                id: true,
                name: true,
                email: true,
                image: true,
                provider: true,
                createdAt: true,
            },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

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
                user,
                stats: {
                    totalItems,
                    totalMovies,
                    totalAnime,
                    averageRating: Number(averageRating.toFixed(1)),
                    statusBreakdown,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch profile" },
            { status: 500 }
        );
    }
}

export async function PATCH(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const { name, currentPassword, newPassword } = await req.json();

        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const updateData: { name?: string; password?: string } = {};

        if (name && name !== user.name) {
            const existingName = await prisma.user.findUnique({ where: { name } });
            if (existingName) {
                return NextResponse.json(
                    { message: "Nama udah dipake user lain" },
                    { status: 400 }
                );
            }
            updateData.name = name;
        }

        if (newPassword) {
            if (!user.password) {
                return NextResponse.json(
                    { message: "Akun Google gak bisa ganti password" },
                    { status: 400 }
                );
            }

            if (!currentPassword) {
                return NextResponse.json(
                    { message: "Password lama wajib diisi" },
                    { status: 400 }
                );
            }

            const isValid = await bcrypt.compare(currentPassword, user.password);
            if (!isValid) {
                return NextResponse.json(
                    { message: "Password lama salah" },
                    { status: 400 }
                );
            }

            updateData.password = await bcrypt.hash(newPassword, 10);
        }

        const updatedUser = await prisma.user.update({
            where: { id: session.user.id },
            data: updateData,
            select: { id: true, name: true, email: true, image: true },
        });

        return NextResponse.json(
            { message: "Profil berhasil diupdate", user: updatedUser },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to update profile" },
            { status: 500 }
        );
    }
}