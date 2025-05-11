import React, { useState, useEffect } from 'react';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import {
    AppBar,
    Box,
    Toolbar,
    Typography,
    Button,
    IconButton,
    Drawer,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    useMediaQuery,
    useTheme,
    Switch,
    FormControlLabel,
    Avatar,
    alpha,
    Divider,
    Tooltip,
    Badge,
    Slide,
    Fade,
    Container,
    Chip,
    } from '@mui/material';
    import {
    Menu as MenuIcon,
    Home as HomeIcon,
    Favorite as FavoriteIcon,
    Movie as MovieIcon,
    Login as LoginIcon,
    Logout as LogoutIcon,
    LightMode,
    DarkMode,
    Close,
    AccountCircle,
    LocalMovies,
    Theaters,
    Notifications,
    Settings,
    Search as SearchIcon,
    } from '@mui/icons-material';
    import { useMovieContext } from '../contexts/MovieContext';
    import SearchBar from './SearchBar';

    const Navbar = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [loginDialogOpen, setLoginDialogOpen] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loginError, setLoginError] = useState('');
    const { darkMode, toggleDarkMode, favoriteMovies } = useMovieContext();
    const navigate = useNavigate();
    const location = useLocation();
    const [scrolled, setScrolled] = useState(false);
    const [searchExpanded, setSearchExpanded] = useState(false);

    // Check if current route is active
    const isActiveRoute = (path) => location.pathname === path;

    // Check scroll position for navbar styling
    useEffect(() => {
        const handleScroll = () => {
        const isScrolled = window.scrollY > 20;
        if (isScrolled !== scrolled) {
            setScrolled(isScrolled);
        }
        };
        window.addEventListener('scroll', handleScroll);
        return () => {
        window.removeEventListener('scroll', handleScroll);
        };
    }, [scrolled]);

    // Toggle drawer
    const toggleDrawer = (open) => (event) => {
        if (
        event.type === 'keydown' &&
        (event.key === 'Tab' || event.key === 'Shift')
        ) {
        return;
        }
        setDrawerOpen(open);
    };

    // Handle login dialog
    const handleLoginDialogOpen = () => {
        setLoginDialogOpen(true);
        setLoginError('');
    };

    const handleLoginDialogClose = () => {
        setLoginDialogOpen(false);
        setUsername('');
        setPassword('');
        setLoginError('');
    };

    // Handle login submit
    const handleLogin = (e) => {
        e.preventDefault();
        
        // Simple validation (would connect to backend in a real app)
        if (username.trim() && password.trim()) {
        // Mock successful login
        setIsLoggedIn(true);
        
        // Store logged in state
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('username', username);
        
        // Close dialog
        handleLoginDialogClose();
        } else {
        setLoginError('Please enter both username and password');
        }
    };

    // Handle logout
    const handleLogout = () => {
        setIsLoggedIn(false);
        localStorage.removeItem('isLoggedIn');
        localStorage.removeItem('username');
        navigate('/');
        setDrawerOpen(false);
    };

    // Toggle search bar on mobile
    const toggleSearchBar = () => {
        setSearchExpanded(!searchExpanded);
    };

    // Check if user is logged in on component mount
    React.useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (loggedIn) {
        setIsLoggedIn(true);
        setUsername(localStorage.getItem('username') || '');
        }
    }, []);

    // Count of favorite movies
    const favoritesCount = favoriteMovies?.length || 0;

    // Navigation drawer content
    const drawerContent = (
        <Box
        sx={{
            width: 280,
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            bgcolor: theme.palette.background.paper,
        }}
        role="presentation"
        >
        <Box
            sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            p: 2,
            bgcolor: theme.palette.primary.main,
            color: theme.palette.primary.contrastText,
            }}
        >
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <MovieIcon sx={{ mr: 1 }} />
            <Typography variant="h6" component="div">
                Movie Explorer
            </Typography>
            </Box>
            <IconButton
            edge="end"
            color="inherit"
            onClick={toggleDrawer(false)}
            aria-label="close drawer"
            >
            <Close />
            </IconButton>
        </Box>

        <Box sx={{ p: 2, display: 'flex', alignItems: 'center' }}>
            {isLoggedIn ? (
            <>
                <Avatar
                sx={{
                    bgcolor: theme.palette.secondary.main,
                    color: theme.palette.secondary.contrastText,
                    width: 40,
                    height: 40,
                }}
                >
                {username.charAt(0).toUpperCase()}
                </Avatar>
                <Box sx={{ ml: 2 }}>
                <Typography variant="subtitle1" fontWeight="bold">
                    {username}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    Movie Enthusiast
                </Typography>
                </Box>
            </>
            ) : (
            <Button
                fullWidth
                variant="contained"
                color="primary"
                startIcon={<LoginIcon />}
                onClick={handleLoginDialogOpen}
            >
                Login to Your Account
            </Button>
            )}
        </Box>

        <Divider />

        <List sx={{ flexGrow: 1, py: 0 }}>
            <ListItem 
            button 
            component={RouterLink} 
            to="/"
            selected={isActiveRoute('/')}
            onClick={toggleDrawer(false)}
            sx={{
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
                },
            }}
            >
            <ListItemIcon>
                <HomeIcon color={isActiveRoute('/') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
                primary="Home" 
                primaryTypographyProps={{ 
                fontWeight: isActiveRoute('/') ? 'bold' : 'regular' 
                }}
            />
            </ListItem>
            
            <ListItem 
            button 
            component={RouterLink} 
            to="/favorites"
            selected={isActiveRoute('/favorites')}
            onClick={toggleDrawer(false)}
            sx={{
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
                },
            }}
            >
            <ListItemIcon>
                <Badge 
                badgeContent={favoritesCount} 
                color="error"
                invisible={favoritesCount === 0}
                >
                <FavoriteIcon color={isActiveRoute('/favorites') ? 'primary' : 'inherit'} />
                </Badge>
            </ListItemIcon>
            <ListItemText 
                primary="Favorites" 
                primaryTypographyProps={{ 
                fontWeight: isActiveRoute('/favorites') ? 'bold' : 'regular' 
                }}
            />
            </ListItem>

            <ListItem 
            button 
            component={RouterLink} 
            to="/now-playing"
            selected={isActiveRoute('/now-playing')}
            onClick={toggleDrawer(false)}
            sx={{
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
                },
            }}
            >
            <ListItemIcon>
                <Theaters color={isActiveRoute('/now-playing') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
                primary="Now Playing" 
                primaryTypographyProps={{ 
                fontWeight: isActiveRoute('/now-playing') ? 'bold' : 'regular' 
                }}
            />
            </ListItem>

            <ListItem 
            button 
            component={RouterLink} 
            to="/top-rated"
            selected={isActiveRoute('/top-rated')}
            onClick={toggleDrawer(false)}
            sx={{
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                '&.Mui-selected': {
                bgcolor: alpha(theme.palette.primary.main, 0.1),
                '&:hover': {
                    bgcolor: alpha(theme.palette.primary.main, 0.2),
                },
                },
            }}
            >
            <ListItemIcon>
                <LocalMovies color={isActiveRoute('/top-rated') ? 'primary' : 'inherit'} />
            </ListItemIcon>
            <ListItemText 
                primary="Top Rated" 
                primaryTypographyProps={{ 
                fontWeight: isActiveRoute('/top-rated') ? 'bold' : 'regular' 
                }}
            />
            </ListItem>
        </List>

        <Divider />

        <List>
            <ListItem sx={{ my: 0.5 }}>
            <FormControlLabel
                control={
                <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    color="primary"
                    size="small"
                />
                }
                label={
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {darkMode ? <DarkMode sx={{ mr: 1 }} /> : <LightMode sx={{ mr: 1 }} />}
                    {darkMode ? "Dark Mode" : "Light Mode"}
                </Box>
                }
            />
            </ListItem>
            
            {isLoggedIn && (
            <ListItem 
                button 
                onClick={handleLogout}
                sx={{
                my: 0.5,
                borderRadius: 1,
                mx: 1,
                color: theme.palette.error.main,
                }}
            >
                <ListItemIcon>
                <LogoutIcon color="error" />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
            )}
        </List>
        </Box>
    );

    return (
        <>
        <Slide appear={false} direction="down" in={!scrolled}>
            <AppBar 
            position="fixed" 
            color="default" 
            elevation={scrolled ? 4 : 0}
            sx={{
                bgcolor: scrolled 
                ? alpha(theme.palette.background.paper, darkMode ? 0.9 : 0.95)
                : theme.palette.background.paper,
                backdropFilter: scrolled ? 'blur(8px)' : 'none',
                borderBottom: scrolled ? 'none' : `1px solid ${theme.palette.divider}`,
                transition: 'all 0.3s ease',
            }}
            >
            <Container maxWidth="xl">
                <Toolbar 
                sx={{ 
                    justifyContent: 'space-between',
                    height: scrolled ? 64 : 80,
                    transition: 'height 0.3s ease',
                }}
                >
                {/* Left: Menu button (mobile) and Logo */}
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    {isMobile && (
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 1 }}
                        onClick={toggleDrawer(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                    )}

                    <Typography
                    variant="h6"
                    component={RouterLink}
                    to="/"
                    sx={{
                        textDecoration: 'none',
                        color: 'inherit',
                        display: 'flex',
                        alignItems: 'center',
                        fontWeight: 'bold',
                        letterSpacing: 0.5,
                    }}
                    >
                    <MovieIcon 
                        sx={{ 
                        mr: 1, 
                        color: theme.palette.primary.main,
                        fontSize: scrolled ? 24 : 28,
                        transition: 'font-size 0.3s ease',
                        }} 
                    />
                    Movie Explorer
                    </Typography>
                </Box>

                {/* Center: Navigation (desktop only) */}
                {!isMobile && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Button
                        color={isActiveRoute('/') ? 'primary' : 'inherit'}
                        component={RouterLink}
                        to="/"
                        startIcon={<HomeIcon />}
                        sx={{ 
                        fontWeight: isActiveRoute('/') ? 'bold' : 'medium',
                        borderBottom: isActiveRoute('/') ? `2px solid ${theme.palette.primary.main}` : 'none',
                        borderRadius: isActiveRoute('/') ? '0px' : undefined,
                        pb: isActiveRoute('/') ? 0.5 : undefined,
                        }}
                    >
                        Home
                    </Button>
                    
                    <Button
                        color={isActiveRoute('/favorites') ? 'primary' : 'inherit'}
                        component={RouterLink}
                        to="/favorites"
                        sx={{ 
                        fontWeight: isActiveRoute('/favorites') ? 'bold' : 'medium',
                        borderBottom: isActiveRoute('/favorites') ? `2px solid ${theme.palette.primary.main}` : 'none',
                        borderRadius: isActiveRoute('/favorites') ? '0px' : undefined,
                        pb: isActiveRoute('/favorites') ? 0.5 : undefined,
                        }}
                        startIcon={
                        <Badge 
                            badgeContent={favoritesCount} 
                            color="error"
                            invisible={favoritesCount === 0}
                            sx={{ '& .MuiBadge-badge': { fontSize: '0.6rem', height: 16, minWidth: 16 } }}
                        >
                            <FavoriteIcon />
                        </Badge>
                        }
                    >
                        Favorites
                    </Button>

                    <Button
                        color={isActiveRoute('/now-playing') ? 'primary' : 'inherit'}
                        component={RouterLink}
                        to="/now-playing"
                        startIcon={<Theaters />}
                        sx={{ 
                        fontWeight: isActiveRoute('/now-playing') ? 'bold' : 'medium',
                        borderBottom: isActiveRoute('/now-playing') ? `2px solid ${theme.palette.primary.main}` : 'none',
                        borderRadius: isActiveRoute('/now-playing') ? '0px' : undefined,
                        pb: isActiveRoute('/now-playing') ? 0.5 : undefined,
                        }}
                    >
                        Now Playing
                    </Button>
                    
                    <Button
                        color={isActiveRoute('/top-rated') ? 'primary' : 'inherit'}
                        component={RouterLink}
                        to="/top-rated"
                        startIcon={<LocalMovies />}
                        sx={{ 
                        fontWeight: isActiveRoute('/top-rated') ? 'bold' : 'medium',
                        borderBottom: isActiveRoute('/top-rated') ? `2px solid ${theme.palette.primary.main}` : 'none',
                        borderRadius: isActiveRoute('/top-rated') ? '0px' : undefined,
                        pb: isActiveRoute('/top-rated') ? 0.5 : undefined,
                        }}
                    >
                        Top Rated
                    </Button>
                    </Box>
                )}

                {/* Right: Theme toggle, search, and user actions */}
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    {isMobile ? (
                    <IconButton 
                        color="inherit" 
                        onClick={toggleSearchBar}
                        sx={{ mr: 0.5 }}
                    >
                        <SearchIcon />
                    </IconButton>
                    ) : null}
                    
                    <Tooltip title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}>
                    <IconButton color="inherit" onClick={toggleDarkMode} sx={{ ml: 0.5 }}>
                        {darkMode ? <LightMode /> : <DarkMode />}
                    </IconButton>
                    </Tooltip>
                    
                    {isLoggedIn ? (
                    <>
                        <Tooltip title="Notifications">
                        <IconButton color="inherit" sx={{ ml: 0.5 }}>
                            <Badge badgeContent={2} color="error">
                            <Notifications />
                            </Badge>
                        </IconButton>
                        </Tooltip>
                        
                        {!isMobile && (
                        <Chip
                            avatar={
                            <Avatar 
                                sx={{ 
                                bgcolor: theme.palette.primary.main,
                                }}
                            >
                                {username.charAt(0).toUpperCase()}
                            </Avatar>
                            }
                            label={username}
                            variant="outlined"
                            sx={{ 
                            borderColor: 'transparent', 
                            ml: 1,
                            '& .MuiChip-label': {
                                fontWeight: 500,
                            }
                            }}
                        />
                        )}
                        
                        {!isMobile && (
                        <Button
                            color="inherit"
                            onClick={handleLogout}
                            startIcon={<LogoutIcon />}
                            sx={{ ml: 1 }}
                        >
                            Logout
                        </Button>
                        )}
                    </>
                    ) : (
                    !isMobile && (
                        <Button
                        variant="contained"
                        color="primary"
                        onClick={handleLoginDialogOpen}
                        startIcon={<LoginIcon />}
                        sx={{ ml: 1 }}
                        >
                        Login
                        </Button>
                    )
                    )}
                </Box>
                </Toolbar>
            </Container>
            
            {/* Search Bar - Full Width */}
            <Fade in={!isMobile || searchExpanded}>
                <Box 
                sx={{ 
                    py: 1.5, 
                    px: 2, 
                    bgcolor: alpha(theme.palette.background.paper, 0.4),
                    backdropFilter: 'blur(8px)',
                    borderTop: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    display: isMobile && !searchExpanded ? 'none' : 'block',
                }}
                >
                <Container maxWidth="xl">
                    <SearchBar 
                    onClose={isMobile ? toggleSearchBar : undefined}
                    showCloseButton={isMobile}
                    />
                </Container>
                </Box>
            </Fade>
            </AppBar>
        </Slide>

        {/* Add a spacer to prevent content from being hidden behind fixed navbar */}
        <Box sx={{ height: searchExpanded || !isMobile ? 128 : 64 }} />

        {/* Mobile Navigation Drawer */}
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
            PaperProps={{
            sx: {
                width: 280,
                borderRadius: 0,
            }
            }}
        >
            {drawerContent}
        </Drawer>

        {/* Login Dialog */}
        <Dialog 
            open={loginDialogOpen} 
            onClose={handleLoginDialogClose}
            PaperProps={{
            elevation: 8,
            sx: {
                borderRadius: 2,
                width: '100%',
                maxWidth: 400,
            }
            }}
        >
            <form onSubmit={handleLogin}>
            <DialogTitle sx={{ pb: 1 }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <AccountCircle sx={{ mr: 1, color: theme.palette.primary.main }} />
                <Typography variant="h6" component="div">
                    Login to Your Account
                </Typography>
                </Box>
            </DialogTitle>
            <DialogContent sx={{ pt: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                Sign in to access your movie favorites and personalized recommendations.
                </Typography>
                <TextField
                autoFocus
                margin="dense"
                label="Username"
                type="text"
                fullWidth
                variant="outlined"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                error={!!loginError}
                sx={{ mb: 2 }}
                />
                <TextField
                margin="dense"
                label="Password"
                type="password"
                fullWidth
                variant="outlined"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                error={!!loginError}
                helperText={loginError}
                />
            </DialogContent>
            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={handleLoginDialogClose} color="inherit">
                Cancel
                </Button>
                <Button 
                type="submit" 
                variant="contained" 
                color="primary"
                disableElevation
                >
                Login
                </Button>
            </DialogActions>
            </form>
        </Dialog>
        </>
    );
};

export default Navbar;