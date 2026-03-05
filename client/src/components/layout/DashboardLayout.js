import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { adminTheme, publicTheme } from '../../theme';
import AppNavbar from './AppNavbar';

/**
 * Layout for authenticated pages that aren't role-specific
 * (e.g. /dashboard, /profile).
 * Picks the correct theme based on user role and renders AppNavbar.
 */
const DashboardLayout = () => {
    const { user } = useAuth();
    const role = user?.role || 'user';
    const theme = ['admin', 'merchant', 'developer'].includes(role) ? adminTheme : publicTheme;

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
                <AppNavbar />
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default DashboardLayout;
