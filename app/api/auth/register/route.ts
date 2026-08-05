import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function SIGNUP(req: Request) {
    const { name, email, password } = await req.json();

    try {
        const UserExits = await prisma.user.findUnique({
            where: {
                email,
            },
        });

        if (UserExits) {
            throw "User is already registered with this email address";
        }

        const hash_password = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hash_password,
            },
        });

        return NextResponse.json({ message: "User registered successfully", user }, { status: 200 });
    } catch (error) {
        return NextResponse.json({ message: error }, { status: 400 });
    }
}
