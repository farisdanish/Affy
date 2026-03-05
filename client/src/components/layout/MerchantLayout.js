import React from 'react';
import { Outlet } from 'react-router-dom';
import { Box, ThemeProvider, CssBaseline } from '@mui/material';
import { adminTheme } from '../../theme';
import AppNavbar from './AppNavbar';

const MerchantLayout = () => {
    return (
        <ThemeProvider theme={adminTheme}>
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

export default MerchantLayout;
