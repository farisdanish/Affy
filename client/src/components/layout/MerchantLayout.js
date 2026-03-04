import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography } from '@mui/material';
import { useAuth } from '../../context/AuthContext';

const MerchantLayout = () => {
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
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Merchant</Typography>
                    <Button component={Link} to="/merchant/slots" color="inherit">My Slots</Button>
                    <Button component={Link} to="/merchant/slots/new" color="inherit">Create Slot</Button>
                    <Button onClick={handleLogout} color="inherit">Logout</Button>
                </Toolbar>
            </AppBar>
            <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Outlet />
            </Box>
        </Box>
    );
};

export default MerchantLayout;
