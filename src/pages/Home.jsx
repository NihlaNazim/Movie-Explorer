import React, { useEffect, useState } from 'react';
import { 
    Container, 
    Typography, 
    Grid, 
    Button, 
    Box, 
    CircularProgress,
    Tabs,
    Tab,
    Snackbar,
    Alert,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
    useTheme,
    useMediaQuery
    } from '@mui/material';
    import { getGenres } from '../api/tmdb';
    import { useMovieContext } from '../contexts/MovieContext';
    import MovieCard from '../components/MovieCard';

    const Home = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
    const { 
        searchResults, 
        trendingMovies, 
        loading, 
        error, 
        searchMovies, 
        fetchTrendingMovies, 
        loadMore,
        currentPage,
        totalPages,
        searchQuery
    } = useMovieContext();
    
    const [tabValue, setTabValue] = useState(0);
    const [genres, setGenres] = useState([]);
    const [selectedGenre, setSelectedGenre] = useState('');
    const [errorSnackbarOpen, setErrorSnackbarOpen] = useState(false);
    const [yearFilter, setYearFilter] = useState('');
    const [ratingFilter, setRatingFilter] = useState('');

    // Fetch genres and trending movies on mount
    useEffect(() => {
        fetchTrendingMovies();
        const loadGenres = async () => {
        try {
            const genresData = await getGenres();
            setGenres(genresData);
        } catch (err) {
            console.error('Failed to load genres:', err);
        }
        };
        loadGenres();
    }, []);

    // Switch to search tab if there is a search query
    useEffect(() => {
        if (searchQuery) setTabValue(1);
    }, [searchQuery]);

    // Show error snackbar on error
    useEffect(() => {
        if (error) setErrorSnackbarOpen(true);
    }, [error]);

    const handleTabChange = (event, newValue) => {
        setTabValue(newValue);
        if (newValue === 0) {
        // Clear filters and reload trending movies
        setSelectedGenre('');
        setYearFilter('');
        setRatingFilter('');
        fetchTrendingMovies();
        }
    };

    // Filter movies by genre, year, rating
    const filterMovies = (movies) => {
        if (!movies) return [];
        let filtered = [...movies];
        if (selectedGenre) {
        filtered = filtered.filter(movie => movie.genre_ids?.includes(parseInt(selectedGenre)));
        }
        if (yearFilter) {
        filtered = filtered.filter(movie => {
            if (!movie.release_date) return false;
            return new Date(movie.release_date).getFullYear().toString() === yearFilter;
        });
        }
        if (ratingFilter) {
        filtered = filtered.filter(movie => movie.vote_average >= parseInt(ratingFilter));
        }
        return filtered;
    };

    const displayMovies = tabValue === 0 ? filterMovies(trendingMovies) : filterMovies(searchResults);

    // Generate last 50 years for year filter dropdown
    const generateYearOptions = () => {
        const currentYear = new Date().getFullYear();
        return Array.from({ length: 50 }, (_, i) => (currentYear - i).toString());
    };

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>
            {tabValue === 0 ? 'Trending Movies' : 'Search Results'}
        </Typography>

        <Tabs value={tabValue} onChange={handleTabChange} centered={!isMobile} variant={isMobile ? 'scrollable' : 'standard'}>
            <Tab label="Trending" />
            <Tab label="Search" />
        </Tabs>

        {/* Filters */}
        <Box sx={{ my: 3, display: 'flex', flexWrap: 'wrap', gap: 2 }}>
            <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="genre-label">Genre</InputLabel>
            <Select
                labelId="genre-label"
                value={selectedGenre}
                label="Genre"
                onChange={(e) => setSelectedGenre(e.target.value)}
            >
                <MenuItem value="">All</MenuItem>
                {genres.map((genre) => (
                <MenuItem key={genre.id} value={genre.id}>{genre.name}</MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="year-label">Year</InputLabel>
            <Select
                labelId="year-label"
                value={yearFilter}
                label="Year"
                onChange={(e) => setYearFilter(e.target.value)}
            >
                <MenuItem value="">All</MenuItem>
                {generateYearOptions().map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
                ))}
            </Select>
            </FormControl>

            <FormControl sx={{ minWidth: 120 }}>
            <InputLabel id="rating-label">Min Rating</InputLabel>
            <Select
                labelId="rating-label"
                value={ratingFilter}
                label="Min Rating"
                onChange={(e) => setRatingFilter(e.target.value)}
            >
                <MenuItem value="">All</MenuItem>
                {[1,2,3,4,5,6,7,8,9,10].map(r => (
                <MenuItem key={r} value={r}>{r}+</MenuItem>
                ))}
            </Select>
            </FormControl>
        </Box>

        {/* Movies Grid */}
        {loading && currentPage === 1 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
            </Box>
        ) : (
            <Grid container spacing={3}>
            {displayMovies.length > 0 ? (
                displayMovies.map(movie => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                    <MovieCard movie={movie} />
                </Grid>
                ))
            ) : (
                <Typography variant="body1" sx={{ m: 3 }}>
                No movies found.
                </Typography>
            )}
            </Grid>
        )}

        {/* Load More Button */}
        {currentPage < totalPages && !loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <Button variant="contained" onClick={loadMore}>
                Load More
            </Button>
            </Box>
        )}

        {/* Loading spinner for load more */}
        {loading && currentPage > 1 && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
            </Box>
        )}

        {/* Error Snackbar */}
        <Snackbar
            open={errorSnackbarOpen}
            autoHideDuration={6000}
            onClose={() => setErrorSnackbarOpen(false)}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
            <Alert onClose={() => setErrorSnackbarOpen(false)} severity="error" sx={{ width: '100%' }}>
            {error}
            </Alert>
        </Snackbar>
        </Container>
    );
};

export default Home;
