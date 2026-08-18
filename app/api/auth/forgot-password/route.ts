import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
    const { email } = await req.json();

    if (!email) {
        return NextResponse.json({ message: "Email wajib diisi" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
        return NextResponse.json(
            { message: "Kalo email terdaftar, link reset udah dikirim" },
            { status: 200 }
        );
    }

    const resetToken = crypto.randomBytes(32).toString("hex");
    const resetTokenExpiry = new Date(Date.now() + 60 * 60 * 1000);

    await prisma.user.update({
        where: { id: user.id },
        data: { resetToken, resetTokenExpiry },
    });

    await sendResetPasswordEmail(user.email, resetToken);

    return NextResponse.json(
        { message: "Kalo email terdaftar, link reset udah dikirim" },
        { status: 200 }
    );
}