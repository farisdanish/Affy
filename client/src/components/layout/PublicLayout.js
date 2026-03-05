import React from 'react';
import { Link, Outlet } from 'react-router-dom';
import { AppBar, Box, Button, Toolbar, Typography, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { publicTheme, adminTheme } from '../../theme';

const PublicLayout = () => {
    const { isAuthenticated, user } = useAuth();
    const role = user?.role || 'user';

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
        </ThemeProvider>
    );
};

export default PublicLayout;
