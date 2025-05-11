import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MovieProvider } from './contexts/MovieContext';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import Favorites from './pages/Favorites';
import { Box } from '@mui/material';

const App = () => {
  const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');

  const theme = createTheme({
    palette: {
      mode: darkMode ? 'dark' : 'light',
      primary: {
        main: '#2196f3', // Vibrant blue
        light: '#64b5f6',
        dark: '#1976d2',
        contrastText: '#ffffff',
      },
      secondary: {
        main: '#ff7043', // Warm orange
        light: '#ff9e80',
        dark: '#f4511e',
        contrastText: '#ffffff',
      },
      background: {
        default: darkMode ? '#121212' : '#f8f9fa',
        paper: darkMode ? '#1e1e1e' : '#ffffff',
      },
      text: {
        primary: darkMode ? '#ffffff' : '#212121',
        secondary: darkMode ? '#b0bec5' : '#757575',
      },
      error: {
        main: '#f44336',
      },
      success: {
        main: '#4caf50',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h1: {
        fontWeight: 800,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h3: {
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h4: {
        fontWeight: 600,
        letterSpacing: '-0.01em',
      },
      h5: {
        fontWeight: 600,
      },
      h6: {
        fontWeight: 500,
      },
      subtitle1: {
        fontWeight: 500,
      },
      button: {
        fontWeight: 600,
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiCard: {
        styleOverrides: {
          root: {
            boxShadow: darkMode 
              ? '0 10px 30px rgba(0,0,0,0.3)' 
              : '0 10px 30px rgba(0,0,0,0.1)',
            borderRadius: 16,
            transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
            '&:hover': {
              transform: 'translateY(-10px)',
              boxShadow: darkMode 
                ? '0 15px 35px rgba(0,0,0,0.5)' 
                : '0 15px 35px rgba(0,0,0,0.15)',
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 28,
            padding: '8px 18px',
            fontWeight: 600,
            transition: 'all 0.2s ease',
          },
          containedPrimary: {
            boxShadow: '0 4px 14px rgba(33, 150, 243, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(33, 150, 243, 0.6)',
              transform: 'translateY(-2px)',
            },
          },
          containedSecondary: {
            boxShadow: '0 4px 14px rgba(255, 112, 67, 0.4)',
            '&:hover': {
              boxShadow: '0 6px 20px rgba(255, 112, 67, 0.6)',
              transform: 'translateY(-2px)',
            },
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: 16,
            fontWeight: 500,
          },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
          },
          elevation1: {
            boxShadow: darkMode 
              ? '0 5px 15px rgba(0,0,0,0.25)' 
              : '0 5px 15px rgba(0,0,0,0.06)',
          },
        },
      },
      MuiAppBar: {
        styleOverrides: {
          root: {
            boxShadow: darkMode 
              ? '0 4px 20px rgba(0,0,0,0.5)' 
              : '0 4px 20px rgba(0,0,0,0.1)',
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 12,
            },
          },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: {
            borderRadius: 16,
          },
        },
      },
    },
  });

  // Pass theme toggle function to the context
  const themeContextValue = {
    darkMode,
    toggleDarkMode: () => {
      const newMode = !darkMode;
      setDarkMode(newMode);
      localStorage.setItem('darkMode', newMode.toString());
    },
  };

  // Load Google Font - Inter
  useEffect(() => {
    const linkEl = document.createElement('link');
    linkEl.setAttribute('rel', 'stylesheet');
    linkEl.setAttribute('href', 'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&display=swap');
    document.head.appendChild(linkEl);
    return () => {
      document.head.removeChild(linkEl);
    };
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <MovieProvider themeContext={themeContextValue}>
        <Router>
          <Box sx={{ 
            minHeight: '100vh',
            background: darkMode 
              ? 'linear-gradient(135deg, #121212 0%, #1a1a2e 100%)' 
              : 'linear-gradient(135deg, #f8f9fa 0%, #e8eaf6 100%)',
            transition: 'background 0.5s ease',
            display: 'flex',
            flexDirection: 'column'
          }}>
            <Navbar />
            <Box sx={{ 
              flexGrow: 1, 
              pt: 2, 
              pb: 6,
              px: { xs: 1, sm: 2 }
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/movie/:id" element={<MovieDetails />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </Box>
          </Box>
        </Router>
      </MovieProvider>
    </ThemeProvider>
  );
};

export default App;