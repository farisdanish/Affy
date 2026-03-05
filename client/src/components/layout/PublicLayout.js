import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { publicTheme, adminTheme } from '../../theme';
import AppNavbar from './AppNavbar';

const PublicLayout = () => {
    const { isAuthenticated, user } = useAuth();
    const role = user?.role || 'user';

    const theme = ['admin', 'merchant', 'developer'].includes(role) ? adminTheme : publicTheme;

    const navItems = [
        { label: 'Slots', to: '/slots' },
        isAuthenticated
            ? { label: 'Dashboard', to: '/dashboard' }
            : { label: 'Login', to: '/login' },
    ];

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
                <AppNavbar title="Affy" navItems={navItems} />
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default PublicLayout;
