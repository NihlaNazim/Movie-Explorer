import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  IconButton, 
  Box, 
  Chip,
  Tooltip,
  alpha
} from '@mui/material';
import { 
  Favorite, 
  FavoriteBorder, 
  Star, 
  CalendarMonth,
  Visibility
} from '@mui/icons-material';
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
    
    // Get vote average with one decimal place
    const voteAverage = movie.vote_average 
        ? movie.vote_average.toFixed(1) 
        : 'N/A';

    // Function to determine rating color
    const getRatingColor = (rating) => {
        if (rating >= 8) return '#4caf50'; // Green
        if (rating >= 6) return '#ff9800'; // Orange
        if (rating >= 4) return '#ff7043'; // Light Red
        return '#f44336'; // Red
    };

    return (
        <Card 
        sx={{ 
            height: '100%', 
            display: 'flex', 
            flexDirection: 'column',
            position: 'relative',
            overflow: 'hidden',
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
                transform: 'translateY(-12px)',
                '& .MuiCardMedia-root': {
                    transform: 'scale(1.08)',
                },
                '& .overlay-content': {
                    opacity: 1,
                },
            },
        }}
        >
            <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                <CardMedia
                    component="img"
                    height="380"
                    image={posterUrl}
                    alt={movie.title}
                    sx={{ 
                        objectFit: 'cover',
                        transition: 'transform 0.7s ease',
                    }}
                />
                
                {/* Rating badge */}
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        top: 16, 
                        left: 16, 
                        bgcolor: 'rgba(0, 0, 0, 0.75)',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backdropFilter: 'blur(8px)',
                        zIndex: 2,
                    }}
                >
                    <Star sx={{ 
                        color: getRatingColor(movie.vote_average), 
                        fontSize: 18 
                    }} />
                    <Typography variant="body2" fontWeight="600">
                        {voteAverage}
                    </Typography>
                </Box>
                
                {/* Year badge */}
                <Box 
                    sx={{ 
                        position: 'absolute', 
                        bottom: 16, 
                        left: 16, 
                        bgcolor: 'rgba(0, 0, 0, 0.75)',
                        color: 'white',
                        borderRadius: '12px',
                        padding: '4px 12px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        backdropFilter: 'blur(8px)',
                        zIndex: 2,
                    }}
                >
                    <CalendarMonth sx={{ fontSize: 16 }} />
                    <Typography variant="body2" fontWeight="600">
                        {releaseYear}
                    </Typography>
                </Box>
                
                {/* Favorite button */}
                <IconButton 
                    onClick={(e) => {
                        e.preventDefault();
                        toggleFavorite(movie);
                    }}
                    sx={{ 
                        position: 'absolute',
                        top: 16,
                        right: 16,
                        bgcolor: alpha('#000000', 0.6),
                        color: 'white',
                        backdropFilter: 'blur(8px)',
                        zIndex: 2,
                        width: 38,
                        height: 38,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                            bgcolor: favorited 
                                ? alpha('#f44336', 0.9) 
                                : alpha('#000000', 0.8),
                            transform: 'scale(1.1)',
                        }
                    }}
                >
                    {favorited ? <Favorite color="error" /> : <FavoriteBorder />}
                </IconButton>
                
                {/* View details overlay (visible on hover) */}
                <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                    <Box 
                        className="overlay-content"
                        sx={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: alpha('#000000', 0.7),
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            alignItems: 'center',
                            opacity: 0,
                            transition: 'opacity 0.3s ease',
                            color: 'white',
                            zIndex: 1,
                            padding: 3,
                            textAlign: 'center',
                        }}
                    >
                        <Visibility sx={{ fontSize: 40, opacity: 0.9, mb: 2 }} />
                        <Typography variant="subtitle1" fontWeight="600">
                            View Details
                        </Typography>
                    </Box>
                </Link>
                
                {/* Gradient overlay */}
                <Box
                    sx={{
                        position: 'absolute',
                        bottom: 0,
                        left: 0,
                        right: 0,
                        height: '70%',
                        background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.5) 50%, rgba(0,0,0,0) 100%)',
                        zIndex: 0,
                    }}
                />
            </Box>
        
            <CardContent sx={{ 
                flexGrow: 1, 
                pt: 2, 
                pb: 3, 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between' 
            }}>
                <Box>
                    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                        <Tooltip title={movie.title} placement="top" arrow>
                            <Typography 
                                variant="h6" 
                                component="div" 
                                sx={{ 
                                    fontWeight: 600, 
                                    mb: 1,
                                    display: '-webkit-box',
                                    WebkitLineClamp: 1,
                                    WebkitBoxOrient: 'vertical',
                                    overflow: 'hidden',
                                    textOverflow: 'ellipsis',
                                    lineHeight: 1.3,
                                }}
                            >
                                {movie.title}
                            </Typography>
                        </Tooltip>
                    </Link>
                    
                    <Typography 
                        variant="body2" 
                        color="text.secondary" 
                        sx={{ 
                            mb: 2,
                            display: '-webkit-box', 
                            WebkitLineClamp: 3, 
                            WebkitBoxOrient: 'vertical', 
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            height: '4.5em',
                            lineHeight: '1.5em'
                        }}
                    >
                        {movie.overview || 'No description available.'}
                    </Typography>
                </Box>
                
                <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none' }}>
                    <Chip 
                        icon={<Visibility fontSize="small" />}
                        label="View Details" 
                        size="medium"
                        clickable
                        color="primary"
                        sx={{ 
                            borderRadius: '20px',
                            mt: 1,
                            fontWeight: 500,
                            px: 1,
                            transition: 'all 0.2s ease',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: '0 4px 12px rgba(33, 150, 243, 0.3)',
                            }
                        }}
                    />
                </Link>
            </CardContent>
        </Card>
    );
};

export default MovieCard;