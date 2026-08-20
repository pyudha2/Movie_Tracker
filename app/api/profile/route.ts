import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { getUserStats } from "@/lib/stats";

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

        const stats = await getUserStats(session.user.id);

        return NextResponse.json({ user, stats }, { status: 200 });
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