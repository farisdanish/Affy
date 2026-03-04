import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, Stack, Toolbar, Tooltip, Typography } from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const MerchantLayout = () => {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useTheme();
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
        <Box sx={{ minHeight: '100vh', background: 'var(--bg)' }}>
            <AppBar
                position="static"
                color="transparent"
                elevation={0}
                sx={{ borderBottom: '1px solid var(--border)', background: 'var(--bg-card)' }}
            >
                <Toolbar sx={{ px: { xs: 2, md: 3 }, py: { xs: 1, md: 0.5 } }}>
                    <Box sx={{ width: '100%' }}>
                        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={1}>
                            <Typography variant="h6" sx={{ color: 'var(--text)', fontWeight: 700 }}>
                                {roleTitle}
                            </Typography>
                            <Stack direction="row" spacing={0.5} alignItems="center">
                                <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                                    <IconButton
                                        onClick={toggleTheme}
                                        sx={{
                                            color: 'var(--text-muted)',
                                            '&:hover': { color: 'var(--primary)', background: 'var(--primary-light)' },
                                        }}
                                    >
                                        {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                                    </IconButton>
                                </Tooltip>
                                <Button onClick={handleLogout} color="inherit" sx={{ color: 'var(--text)', minWidth: 0 }}>
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
                            <Button component={Link} to="/dashboard" color="inherit" sx={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>
                                Dashboard
                            </Button>
                            <Button component={Link} to="/workspace/slots" color="inherit" sx={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>
                                {user?.role === 'admin' || user?.role === 'developer' ? 'All Slots' : 'My Slots'}
                            </Button>
                            <Button component={Link} to="/workspace/slots/new" color="inherit" sx={{ color: 'var(--text)', whiteSpace: 'nowrap' }}>
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
    );
};

export default MerchantLayout;
