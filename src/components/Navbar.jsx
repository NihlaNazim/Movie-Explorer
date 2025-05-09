import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
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
    const { darkMode, toggleDarkMode } = useMovieContext();
    const navigate = useNavigate();

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

    // Check if user is logged in on component mount
    React.useEffect(() => {
        const loggedIn = localStorage.getItem('isLoggedIn') === 'true';
        if (loggedIn) {
        setIsLoggedIn(true);
        setUsername(localStorage.getItem('username') || '');
        }
    }, []);

    // Navigation drawer content
    const drawerContent = (
        <Box
        sx={{ width: 250 }}
        role="presentation"
        onClick={toggleDrawer(false)}
        onKeyDown={toggleDrawer(false)}
        >
        <List>
            <ListItem button component={RouterLink} to="/">
            <ListItemIcon>
                <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Home" />
            </ListItem>
            
            <ListItem button component={RouterLink} to="/favorites">
            <ListItemIcon>
                <FavoriteIcon />
            </ListItemIcon>
            <ListItemText primary="Favorites" />
            </ListItem>

            <ListItem>
            <FormControlLabel
                control={
                <Switch
                    checked={darkMode}
                    onChange={toggleDarkMode}
                    color="primary"
                />
                }
                label={darkMode ? "Dark Mode" : "Light Mode"}
            />
            </ListItem>
            
            {isLoggedIn ? (
            <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                <LogoutIcon />
                </ListItemIcon>
                <ListItemText primary="Logout" />
            </ListItem>
            ) : (
            <ListItem button onClick={handleLoginDialogOpen}>
                <ListItemIcon>
                <LoginIcon />
                </ListItemIcon>
                <ListItemText primary="Login" />
            </ListItem>
            )}
        </List>
        </Box>
    );

    return (
        <>
        <AppBar position="sticky" color="default" elevation={1}>
            <Toolbar>
            {isMobile && (
                <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
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
                flexGrow: 1,
                textDecoration: 'none',
                color: 'inherit',
                display: 'flex',
                alignItems: 'center',
                }}
            >
                <MovieIcon sx={{ mr: 1 }} />
                Movie Explorer
            </Typography>

            {!isMobile && (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Button
                    color="inherit"
                    component={RouterLink}
                    to="/"
                    startIcon={<HomeIcon />}
                >
                    Home
                </Button>
                
                <Button
                    color="inherit"
                    component={RouterLink}
                    to="/favorites"
                    startIcon={<FavoriteIcon />}
                >
                    Favorites
                </Button>
                
                <IconButton color="inherit" onClick={toggleDarkMode}>
                    {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
                
                {isLoggedIn ? (
                    <>
                    <Typography variant="body2" sx={{ mr: 1 }}>
                        Hi, {username}
                    </Typography>
                    <Button
                        color="inherit"
                        onClick={handleLogout}
                        startIcon={<LogoutIcon />}
                    >
                        Logout
                    </Button>
                    </>
                ) : (
                    <Button
                    color="inherit"
                    onClick={handleLoginDialogOpen}
                    startIcon={<LoginIcon />}
                    >
                    Login
                    </Button>
                )}
                </Box>
            )}
            </Toolbar>
            
            <Box sx={{ py: 1, px: 2, bgcolor: 'background.paper' }}>
            <SearchBar />
            </Box>
        </AppBar>

        {/* Mobile Navigation Drawer */}
        <Drawer
            anchor="left"
            open={drawerOpen}
            onClose={toggleDrawer(false)}
        >
            {drawerContent}
        </Drawer>

        {/* Login Dialog */}
        <Dialog open={loginDialogOpen} onClose={handleLoginDialogClose}>
            <form onSubmit={handleLogin}>
            <DialogTitle>Login</DialogTitle>
            <DialogContent>
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
            <DialogActions>
                <Button onClick={handleLoginDialogClose}>Cancel</Button>
                <Button type="submit" variant="contained" color="primary">
                Login
                </Button>
            </DialogActions>
            </form>
        </Dialog>
        </>
    );
};

export default Navbar;