import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { publicTheme } from '../../theme';
import AppNavbar from './AppNavbar';

const AgentLayout = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const navItems = [
        { label: 'Referrals', to: '/agent/referrals' },
        { label: 'Browse Slots', to: '/slots' },
        { label: 'Profile', to: '/profile' },
        { label: 'Logout', onClick: handleLogout },
    ];

    return (
        <ThemeProvider theme={publicTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
                <AppNavbar title="Agent" navItems={navItems} />
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default AgentLayout;
