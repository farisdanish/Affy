import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const AgentLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box sx={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <AppBar position="static" color="transparent" elevation={0} sx={{ borderBottom: '1px solid var(--border)' }}>
                <Toolbar sx={{ gap: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Agent</Typography>
                    <Button component={Link} to="/agent/referrals" color="inherit">Referrals</Button>
                    <Button component={Link} to="/slots" color="inherit">Browse Slots</Button>
                    <Button onClick={handleLogout} color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default AgentLayout;
