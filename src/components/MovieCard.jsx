import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardMedia, Typography, IconButton, Box, Chip } from '@mui/material';
import { Favorite, FavoriteBorder, Star } from '@mui/icons-material';
import { getImageUrl } from '../api/tmdb';
import { useMovieContext } from '../contexts/MovieContext';

const MovieCard = ({ movie }) => {
    const { toggleFavorite, isFavorite } = useMovieContext();
    const favorited = isFavorite(movie.id);
    
    // Placeholder image if no poster is available
    const posterUrl = movie.poster_path 
        ? getImageUrl(movie.poster_path) 
        : '/placeholder-poster.jpg';
    
    // Format the release date to show only the year if available
    const releaseYear = movie.release_date 
        ? new Date(movie.release_date).getFullYear() 
        : 'N/A';

    return (
        <Card 
        sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            transition: 'transform 0.3s ease',
            '&:hover': {
            transform: 'scale(1.03)',
            boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
            },
        }}
        >
        <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit', flexGrow: 1 }}>
            <CardMedia
            component="img"
            height="300"
            image={posterUrl}
            alt={movie.title}
            sx={{ objectFit: 'cover' }}
            />
        </Link>
        
        <Box sx={{ position: 'absolute', top: 10, right: 10 }}>
            <IconButton 
            onClick={(e) => {
                e.preventDefault();
                toggleFavorite(movie);
            }}
            sx={{ 
                backgroundColor: 'rgba(0, 0, 0, 0.6)',
                color: 'white',
                '&:hover': {
                backgroundColor: 'rgba(0, 0, 0, 0.8)',
                }
            }}
            >
            {favorited ? <Favorite color="error" /> : <FavoriteBorder />}
            </IconButton>
        </Box>
        
        <Box 
            sx={{ 
            position: 'absolute', 
            top: 10, 
            left: 10, 
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            color: 'white',
            borderRadius: '4px',
            padding: '4px 8px',
            display: 'flex',
            alignItems: 'center',
            gap: 0.5
            }}
        >
            <Star sx={{ color: 'gold', fontSize: 16 }} />
            <Typography variant="body2">
            {movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}
            </Typography>
        </Box>
        
        <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <Box>
            <Typography variant="h6" component="div" noWrap title={movie.title}>
                {movie.title}
            </Typography>
            <Typography variant="body2" color="text.secondary">
                {releaseYear}
            </Typography>
            </Box>
            
            <Typography 
            variant="body2" 
            color="text.secondary" 
            sx={{ 
                mt: 1, 
                display: '-webkit-box', 
                WebkitLineClamp: 3, 
                WebkitBoxOrient: 'vertical', 
                overflow: 'hidden',
                textOverflow: 'ellipsis'
            }}
            >
            {movie.overview || 'No description available.'}
            </Typography>
            
            <Box sx={{ mt: 2 }}>
            <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                <Chip 
                label="View Details" 
                size="small" 
                clickable 
                color="primary" 
                sx={{ mr: 1 }}
                />
            </Link>
            </Box>
        </CardContent>
        </Card>
    );
};

export default MovieCard;