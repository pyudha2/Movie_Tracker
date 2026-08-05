import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export async function SIGNIN(req: Request) {
    try {
        const { email, password } = await req.json();

        const user = await prisma.user.findUnique({
            where: { email: email },
        });

        if (!user) {
            return NextResponse.json(
                { error: "Email or password is incorrect" },
                { status: 401 }
            );
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Email or password is incorrect" },
                { status: 401 }
            );
        }

        return NextResponse.json({ message: "User logged in successfully", user }, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            { error },
            { status: 500 }
        );
    }
}