import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Stack, Toolbar, Typography, ThemeProvider, CssBaseline } from '@mui/material';
import { useAuth } from '../../context/AuthContext';
import { adminTheme } from '../../theme';

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

    return (
        <ThemeProvider theme={adminTheme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary' }}>
                <AppBar
                    position="static"
                    color="transparent"
                    elevation={0}
                    sx={{ borderBottom: 1, borderColor: 'divider', bgcolor: 'background.paper' }}
                >
                    <Toolbar sx={{ px: { xs: 2, md: 3 }, py: { xs: 1, md: 0.5 } }}>
                        <Box sx={{ width: '100%' }}>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {roleTitle}
                                </Typography>
                                <Stack direction="row" spacing={0.5} alignItems="center">
                                    <Button onClick={handleLogout} color="inherit" sx={{ minWidth: 0 }}>
                                        Logout
                                    </Button>
                                </Stack>
                            </Stack>

                            <Stack
                                direction="row"
                                spacing={1}
                                sx={{
                                    mt: 1,
                                    overflowX: 'auto',
                                    pb: 0.5,
                                    scrollbarWidth: 'none',
                                    '&::-webkit-scrollbar': { display: 'none' },
                                }}
                            >
                                <Button component={Link} to="/dashboard" color="inherit" sx={{ whiteSpace: 'nowrap' }}>
                                    Dashboard
                                </Button>
                                <Button component={Link} to="/workspace/slots" color="inherit" sx={{ whiteSpace: 'nowrap' }}>
                                    {user?.role === 'admin' || user?.role === 'developer' ? 'All Slots' : 'My Slots'}
                                </Button>
                                <Button component={Link} to="/workspace/slots/new" color="inherit" sx={{ whiteSpace: 'nowrap' }}>
                                    Create Slot
                                </Button>
                            </Stack>
                        </Box>
                    </Toolbar>
                </AppBar>
                <Box sx={{ p: { xs: 2, md: 4 } }}>
                    <Outlet />
                </Box>
            </Box>
        </ThemeProvider>
    );
};

export default MerchantLayout;
