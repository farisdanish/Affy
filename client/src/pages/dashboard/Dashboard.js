import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Chip,
} from '@mui/material';
import { LayoutDashboard, LogOut } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
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
                            background: 'rgba(99, 102, 241, 0.08)',
                        },
                    }}
                >
                    Logout
                </Button>
            </Box>

            {/* Welcome card */}
            <Card
                sx={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 24px rgba(99, 102, 241, 0.08)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: '50%',
                                background: 'rgba(99, 102, 241, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}
                        >
                            <LayoutDashboard size={24} color="#6366f1" />
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
                                    background: 'rgba(99, 102, 241, 0.15)',
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
