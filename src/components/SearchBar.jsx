import React, { useState, useEffect } from 'react';
import { 
  Paper, 
  InputBase, 
  IconButton, 
  Box, 
  CircularProgress, 
  Typography,
  Slide,
  Grow,
  Fade,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Search, 
  Clear, 
  Movie as MovieIcon,
  Tune,
  TravelExplore
} from '@mui/icons-material';
import { useMovieContext } from '../contexts/MovieContext';
import { useNavigate } from 'react-router-dom';

const SearchBar = () => {
    const theme = useTheme();
    const { searchMovies, searchQuery, loading } = useMovieContext();
    const [input, setInput] = useState('');
    const [focused, setFocused] = useState(false);
    const [animate, setAnimate] = useState(false);
    const navigate = useNavigate();
    
    // Animation timer
    useEffect(() => {
        const timer = setTimeout(() => {
            setAnimate(true);
        }, 300);
        
        return () => clearTimeout(timer);
    }, []);

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
        // Set focus back to input after clearing
        document.querySelector('input[aria-label="search movies"]').focus();
    };

    return (
        <Fade in={animate} timeout={700}>
            <Box 
              sx={{ 
                width: '100%', 
                maxWidth: 900, 
                mx: 'auto',
                position: 'relative',
                py: 1
              }}
            >
              <Paper
                component="form"
                onSubmit={handleSubmit}
                elevation={focused ? 8 : 2}
                sx={{
                  p: '2px 4px',
                  display: 'flex',
                  alignItems: 'center',
                  borderRadius: 30,
                  boxShadow: focused 
                    ? `0 0 0 2px ${theme.palette.primary.main}, 0 8px 20px ${alpha(theme.palette.primary.main, 0.25)}` 
                    : theme.palette.mode === 'dark' 
                      ? '0 4px 16px rgba(0,0,0,0.5)' 
                      : '0 4px 16px rgba(0,0,0,0.1)',
                  transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  bgcolor: theme.palette.mode === 'dark' 
                    ? alpha(theme.palette.background.paper, 0.8)
                    : alpha(theme.palette.background.paper, 0.8),
                  backdropFilter: 'blur(10px)',
                  '&:hover': {
                    transform: 'translateY(-2px)',
                    boxShadow: theme.palette.mode === 'dark' 
                      ? '0 8px 25px rgba(0,0,0,0.6)' 
                      : '0 8px 25px rgba(0,0,0,0.15)',
                  },
                }}
              >
                <Box 
                  sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    pl: 2,
                    color: focused ? 'primary.main' : 'text.secondary',
                    transition: 'color 0.3s ease'
                  }}
                >
                  <TravelExplore 
                    sx={{ 
                      mr: 1, 
                      fontSize: 24,
                      transition: 'transform 0.3s ease, color 0.3s ease',
                      transform: focused ? 'scale(1.1)' : 'scale(1)'
                    }}
                  />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: focused ? 600 : 500,
                      display: { xs: 'none', sm: 'block' },
                      transition: 'all 0.3s ease'
                    }}
                  >
                    Discover:
                  </Typography>
                </Box>
                
                <InputBase
                  sx={{ 
                    ml: 1, 
                    flex: 1, 
                    fontSize: '1rem',
                    py: 1.5,
                    color: 'text.primary',
                    '& input': {
                      transition: 'font-size 0.3s ease',
                      fontSize: focused ? '1.05rem' : '1rem',
                      fontWeight: focused ? 500 : 400,
                    }
                  }}
                  placeholder="Search for movies, actors, directors, genres..."
                  inputProps={{ 
                    'aria-label': 'search movies',
                    style: { paddingLeft: 8 } 
                  }}
                  value={input}
                  onChange={handleInputChange}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                  disabled={loading}
                />
                
                <Grow in={!!input} timeout={300}>
                  <Box sx={{ display: input ? 'block' : 'none' }}>
                    <IconButton 
                      aria-label="clear search" 
                      onClick={clearSearch}
                      sx={{ 
                        mx: 0.5,
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          backgroundColor: alpha(theme.palette.error.main, 0.1),
                          color: theme.palette.error.main,
                          transform: 'rotate(90deg)',
                        }
                      }}
                      disabled={loading}
                      size="small"
                    >
                      <Clear fontSize="small" />
                    </IconButton>
                  </Box>
                </Grow>
                
                <IconButton 
                  type="submit" 
                  aria-label="search"
                  color="primary"
                  disabled={loading || !input.trim()}
                  sx={{ 
                    p: 1.5,
                    mx: 0.5,
                    bgcolor: theme.palette.mode === 'dark'
                      ? alpha(theme.palette.primary.main, 0.15)
                      : alpha(theme.palette.primary.main, 0.1),
                    color: input.trim() ? theme.palette.primary.main : alpha(theme.palette.primary.main, 0.7),
                    transition: 'all 0.2s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    '&:hover': {
                      bgcolor: alpha(theme.palette.primary.main, 0.2),
                      transform: 'scale(1.05)',
                    },
                    '&.Mui-disabled': {
                      bgcolor: 'transparent',
                    }
                  }}
                >
                  {loading ? (
                    <CircularProgress size={24} thickness={4} color="primary" />
                  ) : (
                    <Search />
                  )}
                </IconButton>
              </Paper>

              <Slide direction="down" in={focused} mountOnEnter unmountOnExit timeout={300}>
                <Box 
                  sx={{ 
                    position: 'absolute', 
                    top: '100%', 
                    left: '50%', 
                    transform: 'translateX(-50%)',
                    mt: 1, 
                    zIndex: 10,
                    display: 'flex',
                    justifyContent: 'center',
                    width: '100%',
                    pointerEvents: 'none'
                    }}
                    >
                    <Typography 
                        variant="caption" 
                        sx={{ 
                        bgcolor: alpha(theme.palette.background.paper, 0.9),
                        boxShadow: 1,
                        borderRadius: 10,
                        py: 0.5,
                        px: 2,
                        backdropFilter: 'blur(8px)',
                        fontWeight: 500,
                        }}
                    >
                        Press Enter to search
                    </Typography>
                    </Box>
                </Slide>
            </Box>
        </Fade>
    );
};

export default SearchBar;