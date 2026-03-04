import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const PublicLayout = () => {
    const { isAuthenticated } = useAuth();

    return (
        <Box sx={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid var(--border)' }}>
                <Toolbar sx={{ gap: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Affy</Typography>
                    <Button component={Link} to="/slots" color="inherit">Slots</Button>
                    {isAuthenticated ? (
                        <Button component={Link} to="/dashboard" color="inherit">Dashboard</Button>
                    ) : (
                        <Button component={Link} to="/login" color="inherit">Login</Button>
                    )}
                </Toolbar>
            </AppBar>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default PublicLayout;
