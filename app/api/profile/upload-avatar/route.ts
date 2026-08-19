import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadAvatar } from "@/lib/cloudinary";

export async function POST(req: NextRequest) {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const user = await prisma.user.findUnique({
            where: { id: session.user.id },
        });

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        if (user.provider === "google") {
            return NextResponse.json(
                { message: "Akun Google pake foto dari Google, gak bisa diganti manual" },
                { status: 400 }
            );
        }

        const formData = await req.formData();
        const file = formData.get("avatar") as File | null;

        if (!file) {
            return NextResponse.json({ message: "File gak ditemukan" }, { status: 400 });
        }

        if (!file.type.startsWith("image/")) {
            return NextResponse.json(
                { message: "File harus berupa gambar" },
                { status: 400 }
            );
        }

        const MAX_SIZE = 5 * 1024 * 1024;
        if (file.size > MAX_SIZE) {
            return NextResponse.json(
                { message: "Ukuran file maksimal 5MB" },
                { status: 400 }
            );
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const imageUrl = await uploadAvatar(buffer, session.user.id);

        await prisma.user.update({
            where: { id: session.user.id },
            data: { image: imageUrl },
        });

        return NextResponse.json(
            { message: "Foto profil berhasil diupdate", imageUrl },
            { status: 200 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to upload avatar" },
            { status: 500 }
        );
    }
}