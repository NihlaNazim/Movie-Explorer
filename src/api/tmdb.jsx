import axios from 'axios';

// Create an Axios instance with base URL and common headers
const API_KEY = '0a7e366d827c825400d7c554efb1a8f0'; // Replace with your actual API key
const BASE_URL = 'https://api.themoviedb.org/3';

const tmdbApi = axios.create({
    baseURL: BASE_URL,
    params: {
        api_key: API_KEY,
    },
    });

    // API endpoints functions
    export const getMovies = async (searchQuery, page = 1) => {
    try {
        const response = await tmdbApi.get('/search/movie', {
        params: {
            query: searchQuery,
            page: page,
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
    };

    export const getTrendingMovies = async (timeWindow = 'day', page = 1) => {
    try {
        const response = await tmdbApi.get(`/trending/movie/${timeWindow}`, {
        params: {
            page: page,
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching trending movies:', error);
        throw error;
    }
    };

    export const getMovieDetails = async (movieId) => {
    try {
        const response = await tmdbApi.get(`/movie/${movieId}`, {
        params: {
            append_to_response: 'videos,credits',
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
    };

    export const getMoviesByGenre = async (genreId, page = 1) => {
    try {
        const response = await tmdbApi.get('/discover/movie', {
        params: {
            with_genres: genreId,
            page: page,
        },
        });
        return response.data;
    } catch (error) {
        console.error('Error fetching movies by genre:', error);
        throw error;
    }
    };

    export const getGenres = async () => {
    try {
        const response = await tmdbApi.get('/genre/movie/list');
        return response.data.genres;
    } catch (error) {
        console.error('Error fetching genres:', error);
        throw error;
    }
    };

    // Image URL helper
    export const getImageUrl = (path, size = 'w500') => {
    if (!path) return null;
    return `https://image.tmdb.org/t/p/${size}${path}`;
    };

    // Youtube trailer URL helper
    export const getYoutubeUrl = (videoKey) => {
    if (!videoKey) return null;
    return `https://www.youtube.com/embed/${videoKey}`;
};

export default tmdbApi;