import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, IconButton, Toolbar, Tooltip, Typography } from '@mui/material';
import { Moon, Sun } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';

const AgentLayout = () => {
    const { logout } = useAuth();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();

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
                <Toolbar sx={{ gap: 2 }}>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Agent</Typography>
                    <Button component={Link} to="/agent/referrals" color="inherit">Referrals</Button>
                    <Button component={Link} to="/slots" color="inherit">Browse Slots</Button>
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
