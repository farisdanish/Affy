import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography, ThemeProvider, CssBaseline, Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { publicTheme, adminTheme } from '../../theme';

const PublicLayout = () => {
    const { isAuthenticated, user } = useAuth();
    const role = user?.role || 'user';

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const theme = ['admin', 'merchant', 'developer'].includes(role) ? adminTheme : publicTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
                >
                    <Toolbar sx={{ gap: 2 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>Affy</Typography>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            <Button component={Link} to="/slots" color="inherit">Slots</Button>
                            {isAuthenticated ? (
                                <Button component={Link} to="/dashboard" color="inherit">Dashboard</Button>
                            ) : (
                                <Button component={Link} to="/login" color="inherit">Login</Button>
                            )}
                        </Box>
                        <IconButton
                            color="inherit"
                            onClick={handleMenuClick}
                            sx={{ display: { xs: 'flex', md: 'none' } }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Menu
                            anchorEl={anchorEl}
                            open={open}
                            onClose={handleMenuClose}
                            PaperProps={{
                                sx: { width: 200 }
                            }}
                        >
                            <MenuItem component={Link} to="/slots" onClick={handleMenuClose}>Slots</MenuItem>
                            {isAuthenticated ? (
                                <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>Dashboard</MenuItem>
                            ) : (
                                <MenuItem component={Link} to="/login" onClick={handleMenuClose}>Login</MenuItem>
                            )}
                        </Menu>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default PublicLayout;
