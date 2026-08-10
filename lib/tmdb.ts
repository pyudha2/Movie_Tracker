import axios from "axios";

const TMDB_BASE_URL = process.env.TMDB_BASE_URL;
const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdbClient = axios.create({
    baseURL: TMDB_BASE_URL,
    headers: {
        Authorization: `Bearer ${TMDB_API_KEY}`,
        Accept: "application/json",
    },
});

export interface TMDBMovie {
    id: number;
    title: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    release_date: string;
    vote_average: number;
    genre_ids: number[];
}

export interface TMDBMovieDetail extends TMDBMovie {
    genres: { id: number; name: string }[];
    runtime: number;
    tagline: string;
}

export const searchMovies = async (query: string, page: number = 1) => {
    const { data } = await tmdbClient.get("/search/movie", {
        params: { query, page },
    });
    return data;
};

export const getMovieDetail = async (id: number) => {
    const { data } = await tmdbClient.get(`/movie/${id}`);
    return data;
};

export const getPopularMovies = async (page: number = 1) => {
    const { data } = await tmdbClient.get("/movie/popular", {
        params: { page },
    });
    return data;
};

export const getImageUrl = (path: string | null, size: string = "w500") => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
};
