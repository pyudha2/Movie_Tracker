import { NextResponse } from "next/server";
import { getNowPlayingMovies } from "@/lib/tmdb";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") ?? "1");

    try {
        const data = await getNowPlayingMovies(page);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch now playing movies" },
            { status: 500 }
        );
    }
}