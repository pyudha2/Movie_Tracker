import axios from "axios";

const JIKAN_BASE_URL = process.env.NEXT_PUBLIC_JIKAN_BASE_URL;

const jikanClient = axios.create({
    baseURL: JIKAN_BASE_URL,
});

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

export const searchAnime = async (query: string, page: number = 1) => {
    const { data } = await jikanClient.get("/anime", {
        params: { q: query, page, limit: 20 },
    });
    return data;
};

export const getAnimeDetail = async (id: number) => {
    const { data } = await jikanClient.get<{ data: JikanAnime }>(
        `/anime/${id}`
    );
    return data.data;
};

export const getTopAnime = async (page: number = 1) => {
    const { data } = await jikanClient.get("/top/anime", {
        params: { page },
    });
    return data;
};