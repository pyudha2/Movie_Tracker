import axios from "axios";

const JIKAN_BASE_URL = process.env.NEXT_PUBLIC_JIKAN_BASE_URL;

const jikanClient = axios.create({
    baseURL: JIKAN_BASE_URL,
    timeout: 10000,
});

let queue: Promise<unknown> = Promise.resolve();
const MIN_GAP_MS = 500;

const enqueue = <T>(fn: () => Promise<T>): Promise<T> => {
    const run = queue.then(() =>
        fn().finally(() => new Promise((resolve) => setTimeout(resolve, MIN_GAP_MS)))
    );
    queue = run.catch(() => { });
    return run;
};

export interface JikanAnime {
    mal_id: number;
    title: string;
    synopsis: string;
    images: {
        jpg: {
            image_url: string;
            large_image_url: string;
        };
    };
    score: number;
    episodes: number;
    status: string;
    genres: { mal_id: number; name: string }[];
}

export const searchAnime = async (query: string, page: number = 1, signal?: AbortSignal) => {
    return enqueue(async () => {
        const { data } = await jikanClient.get("/anime", {
            params: { q: query, page, limit: 20 },
            signal,
        });
        return data;
    });
};

export const getAnimeDetail = async (id: number, signal?: AbortSignal) => {
    return enqueue(async () => {
        const { data } = await jikanClient.get<{ data: JikanAnime }>(
            `/anime/${id}`,
            { signal }
        );
        return data.data;
    });
};

export const getTopAnime = async (page: number = 1, signal?: AbortSignal) => {
    return enqueue(async () => {
        const { data } = await jikanClient.get("/top/anime", {
            params: { page },
            signal,
        });
        return data;
    });
};

export const getSeasonalAnime = async (
    year: number,
    season: "winter" | "spring" | "summer" | "fall",
    page: number = 1,
    signal?: AbortSignal
) => {
    return enqueue(async () => {
        const { data } = await jikanClient.get(`/seasons/${year}/${season}`, {
            params: { page, limit: 10 },
            signal,
        });
        return data;
    });
};

export const getUpcomingSeasonAnime = async (page: number = 1, signal?: AbortSignal) => {
    return enqueue(async () => {
        const { data } = await jikanClient.get("/seasons/upcoming", {
            params: { page, limit: 10 },
            signal,
        });
        return data;
    });
};

export const getAnimeRecommendations = async (page: number = 1, signal?: AbortSignal) => {
    return enqueue(async () => {
        const { data } = await jikanClient.get("/recommendations/anime", {
            params: { page },
            signal,
        });
        return data;
    });
};