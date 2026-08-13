import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
    const { name, email, password } = await req.json();

    try {
        const userExists = await prisma.user.findFirst({
            where: {
                OR: [{ email }, { name }],
            },
        });

        if (userExists) {
            return NextResponse.json(
                { message: "Email or name is already registered" },
                { status: 400 }
            );
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        const userWithoutPassword = {
            id: user.id,
            name: user.name,
            email: user.email,
            createdAt: user.createdAt,
        };

        return NextResponse.json(
            { message: "User registered successfully", user: userWithoutPassword },
            { status: 201 }
        );
    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: "Something went wrong" }, { status: 500 });
    }
}