import React, { useState, useEffect } from 'react';
import { Paper, InputBase, IconButton, Box, CircularProgress } from '@mui/material';
import { Search, Clear } from '@mui/icons-material';
import { useMovieContext } from '../contexts/MovieContext';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const { searchMovies, searchQuery, loading } = useMovieContext();
    const [input, setInput] = useState('');
    const navigate = useNavigate();

    // Initialize input with searchQuery from context
    useEffect(() => {
        if (searchQuery) {
        setInput(searchQuery);
        }
    }, [searchQuery]);

    // Handle input change
    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    // Handle search submission
    const handleSubmit = (e) => {
        e.preventDefault();
        if (input.trim()) {
        searchMovies(input);
        navigate('/'); // Navigate to home page to display results
        }
    };

    // Clear search
    const clearSearch = () => {
        setInput('');
        // Don't clear results here, let the empty search be submitted if user presses search
    };

    return (
        <Box sx={{ width: '100%', maxWidth: 600, mx: 'auto' }}>
        <Paper
            component="form"
            onSubmit={handleSubmit}
            sx={{
            p: '2px 4px',
            display: 'flex',
            alignItems: 'center',
            borderRadius: 20,
            boxShadow: 3,
            transition: 'box-shadow 0.3s ease',
            '&:hover': {
                boxShadow: 6,
            },
            }}
        >
            <IconButton 
            type="submit" 
            aria-label="search"
            sx={{ p: '10px' }}
            disabled={loading}
            >
            {loading ? (
                <CircularProgress size={24} />
            ) : (
                <Search />
            )}
            </IconButton>
            
            <InputBase
            sx={{ ml: 1, flex: 1 }}
            placeholder="Search for movies..."
            inputProps={{ 'aria-label': 'search movies' }}
            value={input}
            onChange={handleInputChange}
            disabled={loading}
            />
            
            {input && (
            <IconButton 
                aria-label="clear search" 
                onClick={clearSearch}
                sx={{ p: '10px' }}
                disabled={loading}
            >
                <Clear />
            </IconButton>
            )}
        </Paper>
        </Box>
    );
};

export default SearchBar;