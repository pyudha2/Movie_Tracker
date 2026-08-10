import { NextResponse } from "next/server";
import { getMovieDetail } from "@/lib/tmdb";

export async function GET(
    req: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    const { id } = await params;

    try {
        const data = await getMovieDetail(Number(id));
        return NextResponse.json(data, { status: 200 });
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            { message: "Failed to fetch movie detail" },
            { status: 500 }
        );
    }
}