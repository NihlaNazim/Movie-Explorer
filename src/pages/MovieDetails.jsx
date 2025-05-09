import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { 
    Container, 
    Typography, 
    Box, 
    CircularProgress, 
    Chip, 
    Grid, 
    Avatar,
    Link
    } from '@mui/material';
    import { getMovieDetails, getImageUrl, getYoutubeUrl } from '../api/tmdb';

    const MovieDetails = () => {
    const { id } = useParams();
    const [movie, setMovie] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDetails = async () => {
        setLoading(true);
        try {
            const data = await getMovieDetails(id);
            setMovie(data);
        } catch (err) {
            setError('Failed to load movie details.');
        } finally {
            setLoading(false);
        }
        };
        fetchDetails();
    }, [id]);

    if (loading) {
        return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 6 }}>
            <CircularProgress />
        </Box>
        );
    }

    if (error) {
        return (
        <Container sx={{ mt: 4 }}>
            <Typography variant="h6" color="error">{error}</Typography>
        </Container>
        );
    }

    if (!movie) return null;

    // Get trailer video key (prefer official YouTube trailer)
    const trailer = movie.videos?.results.find(
        vid => vid.type === 'Trailer' && vid.site === 'YouTube'
    );

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h3" gutterBottom>{movie.title}</Typography>
        <Typography variant="subtitle1" gutterBottom>
            {movie.tagline && `"${movie.tagline}"`}
        </Typography>

        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 4 }}>
            {/* Poster */}
            <Box sx={{ minWidth: 300 }}>
            <img 
                src={getImageUrl(movie.poster_path, 'w500')} 
                alt={movie.title} 
                style={{ width: '100%', borderRadius: 8 }}
            />
            </Box>

            {/* Details */}
            <Box sx={{ flex: 1 }}>
            <Typography variant="body1" paragraph>{movie.overview}</Typography>

            <Box sx={{ mb: 2 }}>
                <Typography variant="subtitle2">Genres:</Typography>
                {movie.genres.map(genre => (
                <Chip key={genre.id} label={genre.name} sx={{ mr: 1, mt: 1 }} />
                ))}
            </Box>

            <Typography variant="subtitle2" gutterBottom>
                Release Date: {movie.release_date}
            </Typography>
            <Typography variant="subtitle2" gutterBottom>
                Rating: {movie.vote_average} / 10 ({movie.vote_count} votes)
            </Typography>

            {/* Cast */}
            <Box sx={{ mt: 4 }}>
                <Typography variant="h6" gutterBottom>Cast</Typography>
                <Grid container spacing={2}>
                {movie.credits?.cast.slice(0, 6).map(actor => (
                    <Grid item xs={4} sm={2} key={actor.cast_id}>
                    <Box sx={{ textAlign: 'center' }}>
                        <Avatar 
                        alt={actor.name} 
                        src={getImageUrl(actor.profile_path, 'w185')} 
                        sx={{ width: 80, height: 80, mx: 'auto' }}
                        />
                        <Typography variant="body2" noWrap>{actor.name}</Typography>
                        <Typography variant="caption" color="text.secondary" noWrap>
                        as {actor.character}
                        </Typography>
                    </Box>
                    </Grid>
                ))}
                </Grid>
            </Box>
            </Box>
        </Box>

        {/* Trailer */}
        {trailer && (
            <Box sx={{ mt: 6 }}>
            <Typography variant="h5" gutterBottom>Trailer</Typography>
            <Box sx={{ position: 'relative', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                <iframe
                src={getYoutubeUrl(trailer.key)}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    border: 0,
                    borderRadius: 8,
                }}
                />
            </Box>
            </Box>
        )}
        </Container>
    );
};

export default MovieDetails;
