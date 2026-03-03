import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
    IconButton,
    Tooltip,
} from '@mui/material';
import { LayoutDashboard, LogOut, Sun, Moon } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                background: 'var(--bg)',
                padding: { xs: 3, md: 6 },
                transition: 'background 0.3s ease',
            }}
        >
            {/* Top bar */}
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography
                    variant="h5"
                    sx={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
                >
                    Affy
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                        <IconButton
                            id="theme-toggle"
                            onClick={toggleTheme}
                            sx={{
                                color: 'var(--text-muted)',
                                '&:hover': {
                                    color: 'var(--primary)',
                                    background: 'var(--primary-light)',
                                },
                            }}
                        >
                            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </IconButton>
                    </Tooltip>
                    <Button
                        id="logout-button"
                        onClick={handleLogout}
                        variant="outlined"
                        startIcon={<LogOut size={18} />}
                        sx={{
                            borderRadius: 'var(--radius)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-muted)',
                            textTransform: 'none',
                            fontFamily: 'Inter, sans-serif',
                            '&:hover': {
                                borderColor: 'var(--primary)',
                                color: 'var(--primary)',
                                background: 'var(--primary-light)',
                            },
                        }}
                    >
                        Logout
                    </Button>
                </Box>
            </Box>

            {/* Welcome card */}
            <Card
                sx={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow)',
                    transition: 'background 0.3s ease, box-shadow 0.3s ease',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'var(--primary-light)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <LayoutDashboard size={24} style={{ color: 'var(--primary)' }} />
                        </Box>
                        <Box>
                            <Typography
                                variant="h6"
                                sx={{ fontWeight: 600, color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
                            >
                                Welcome back, {user?.name || 'User'}
                            </Typography>
                            <Chip
                                label={user?.role?.charAt(0).toUpperCase() + user?.role?.slice(1)}
                                size="small"
                                sx={{
                                    mt: 0.5,
                                    background: 'var(--primary-light)',
                                    color: 'var(--primary)',
                                    fontWeight: 500,
                                    fontFamily: 'Inter, sans-serif',
                                }}
                            />
                        </Box>
                    </Box>
                    <Typography
                        variant="body2"
                        sx={{ color: 'var(--text-muted)', mt: 2 }}
                    >
                        Your dashboard is being built. More features are coming in Sprint 2.
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Dashboard;
