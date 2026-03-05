import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography, ThemeProvider, CssBaseline, Menu, MenuItem, IconButton } from '@mui/material';
import { Menu as MenuIcon } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { publicTheme } from '../../theme';

const AgentLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleMenuClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <ThemeProvider theme={publicTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
                >
                    <Toolbar sx={{ gap: 2 }}>
                        <Typography variant="h6" sx={{ flexGrow: 1 }}>Agent</Typography>
                        <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 2 }}>
                            <Button component={Link} to="/agent/referrals" color="inherit">Referrals</Button>
                            <Button component={Link} to="/slots" color="inherit">Browse Slots</Button>
                            <Button component={Link} to="/profile" color="inherit">Profile</Button>
                            <Button onClick={handleLogout} color="inherit">Logout</Button>
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
                            <MenuItem component={Link} to="/agent/referrals" onClick={handleMenuClose}>Referrals</MenuItem>
                            <MenuItem component={Link} to="/slots" onClick={handleMenuClose}>Browse Slots</MenuItem>
                            <MenuItem component={Link} to="/profile" onClick={handleMenuClose}>Profile</MenuItem>
                            <MenuItem onClick={() => { handleMenuClose(); handleLogout(); }}>Logout</MenuItem>
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

export default AgentLayout;
