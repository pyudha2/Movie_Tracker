import { NextResponse } from "next/server";
import { getUpcomingMoviesByMonth } from "@/lib/tmdb";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const now = new Date();
    const year = Number(searchParams.get("year") ?? now.getFullYear());
    const month = Number(searchParams.get("month") ?? now.getMonth() + 1);
    const page = Number(searchParams.get("page") ?? "1");

    try {
        const data = await getUpcomingMoviesByMonth(year, month, page);
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch upcoming movies" },
            { status: 500 }
        );
    }
}