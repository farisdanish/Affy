import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { adminTheme } from '../../theme';
import AppNavbar from './AppNavbar';

const MerchantLayout = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const roleTitle = user?.role === 'admin'
        ? 'Admin'
        : user?.role === 'developer'
            ? 'Developer'
            : 'Merchant';

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Dashboard', to: '/dashboard' },
        {
            label: user?.role === 'admin' || user?.role === 'developer' ? 'All Slots' : 'My Slots',
            to: '/workspace/slots',
        },
        { label: 'Create Slot', to: '/workspace/slots/new' },
        { label: 'Profile', to: '/profile' },
        { label: 'Logout', onClick: handleLogout },
    ];

    return (
        <ThemeProvider theme={adminTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
                <AppNavbar title={roleTitle} navItems={navItems} />
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default MerchantLayout;
