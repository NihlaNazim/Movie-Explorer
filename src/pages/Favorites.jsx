import React from 'react';
import { Container, Typography, Grid, Box } from '@mui/material';
import { useMovieContext } from '../contexts/MovieContext';
import MovieCard from '../components/MovieCard';

const Favorites = () => {
    const { favoriteMovies } = useMovieContext();

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
        <Typography variant="h4" gutterBottom>My Favorite Movies</Typography>
        {favoriteMovies.length === 0 ? (
            <Typography variant="body1">You have no favorite movies yet.</Typography>
        ) : (
            <Grid container spacing={3}>
            {favoriteMovies.map(movie => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
                <MovieCard movie={movie} />
                </Grid>
            ))}
            </Grid>
        )}
        </Container>
    );
};

export default Favorites;
