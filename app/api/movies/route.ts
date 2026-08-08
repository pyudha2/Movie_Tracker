import { NextResponse } from "next/server";
import { searchMovies, getPopularMovies } from "@/lib/tmdb";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get("query") ?? "";
    const page = Number(searchParams.get("page") ?? "1");

    try {
        const data = query
            ? await searchMovies(query, page)
            : await getPopularMovies(page);

        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch movies" },
            { status: 500 }
        );
    }
}