import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMovies, getTrendingMovies } from '../api/tmdb';

// Create the context
const MovieContext = createContext();

// Custom hook to use the movie context
export const useMovieContext = () => useContext(MovieContext);

export const MovieProvider = ({ children }) => {
  // State for movies data
    const [searchResults, setSearchResults] = useState([]);
    const [trendingMovies, setTrendingMovies] = useState([]);
    const [favoriteMovies, setFavoriteMovies] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);
    const [searchQuery, setSearchQuery] = useState('');
    const [darkMode, setDarkMode] = useState(false);

    // Load favorites from localStorage on mount
    useEffect(() => {
        const storedFavorites = localStorage.getItem('favoriteMovies');
        if (storedFavorites) {
        setFavoriteMovies(JSON.parse(storedFavorites));
        }
        
        // Load last search query from localStorage
        const lastSearch = localStorage.getItem('lastSearchQuery');
        if (lastSearch) {
        setSearchQuery(lastSearch);
        }
        
        // Load theme preference
        const storedTheme = localStorage.getItem('darkMode');
        if (storedTheme !== null) {
        setDarkMode(JSON.parse(storedTheme));
        } else {
        // Check system preference
        const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches;
        setDarkMode(prefersDarkMode);
        }
    }, []);

    // Save favorites to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem('favoriteMovies', JSON.stringify(favoriteMovies));
    }, [favoriteMovies]);

    // Save search query to localStorage whenever it changes
    useEffect(() => {
        if (searchQuery) {
        localStorage.setItem('lastSearchQuery', searchQuery);
        }
    }, [searchQuery]);

    // Save theme preference
    useEffect(() => {
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        if (darkMode) {
        document.body.classList.add('dark-mode');
        } else {
        document.body.classList.remove('dark-mode');
        }
    }, [darkMode]);

    // Function to toggle dark mode
    const toggleDarkMode = () => {
        setDarkMode(!darkMode);
    };

    // Function to fetch trending movies
    const fetchTrendingMovies = async (page = 1) => {
        setLoading(true);
        setError(null);
        try {
        const data = await getTrendingMovies('day', page);
        setTrendingMovies(prev => page > 1 ? [...prev, ...data.results] : data.results);
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
        } catch (err) {
        setError('Failed to fetch trending movies. Please try again later.');
        } finally {
        setLoading(false);
        }
    };

    // Function to search for movies
    const searchMovies = async (query, page = 1) => {
        if (!query.trim()) {
        setSearchResults([]);
        setTotalPages(0);
        return;
        }
        
        setLoading(true);
        setError(null);
        setSearchQuery(query);
        
        try {
        const data = await getMovies(query, page);
        setSearchResults(prev => page > 1 ? [...prev, ...data.results] : data.results);
        setTotalPages(data.total_pages);
        setCurrentPage(data.page);
        } catch (err) {
        setError('Failed to search movies. Please try again later.');
        } finally {
        setLoading(false);
        }
    };

    // Function to load more results (pagination)
    const loadMore = async () => {
        if (loading || currentPage >= totalPages) return;
        
        const nextPage = currentPage + 1;
        if (searchQuery) {
        await searchMovies(searchQuery, nextPage);
        } else {
        await fetchTrendingMovies(nextPage);
        }
    };

    // Function to add/remove a movie to/from favorites
    const toggleFavorite = (movie) => {
        setFavoriteMovies(prev => {
        const isFavorite = prev.some(m => m.id === movie.id);
        if (isFavorite) {
            return prev.filter(m => m.id !== movie.id);
        } else {
            return [...prev, movie];
        }
        });
    };

    // Check if a movie is in favorites
    const isFavorite = (movieId) => {
        return favoriteMovies.some(movie => movie.id === movieId);
    };

    // Create the context value object
    const contextValue = {
        searchResults,
        trendingMovies,
        favoriteMovies,
        loading,
        error,
        currentPage,
        totalPages,
        searchQuery,
        darkMode,
        searchMovies,
        fetchTrendingMovies,
        loadMore,
        toggleFavorite,
        isFavorite,
        toggleDarkMode,
    };

    return (
        <MovieContext.Provider value={contextValue}>
        {children}
        </MovieContext.Provider>
    );
};

export default MovieContext;