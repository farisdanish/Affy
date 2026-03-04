import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import {
    Box,
    Button,
    Card,
    CardContent,
    Chip,
    IconButton,
    Stack,
    Tooltip,
    Typography,
} from '@mui/material';
import { LayoutDashboard, Moon, Sun } from 'lucide-react';

const Dashboard = () => {
    const { user, logout } = useAuth();
    const { mode, toggleTheme } = useTheme();
    const navigate = useNavigate();

    const role = user?.role || 'user';
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

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
            <Box
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    mb: 4,
                }}
            >
                <Typography variant="h5" sx={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}>
                    Affy
                </Typography>
                <Stack direction="row" spacing={1}>
                    <Tooltip title={mode === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}>
                        <IconButton
                            id="theme-toggle"
                            onClick={toggleTheme}
                            sx={{
                                color: 'var(--text-muted)',
                                '&:hover': { color: 'var(--primary)', background: 'var(--primary-light)' },
                            }}
                        >
                            {mode === 'light' ? <Moon size={20} /> : <Sun size={20} />}
                        </IconButton>
                    </Tooltip>
                    <Button
                        onClick={handleLogout}
                        variant="outlined"
                        sx={{
                            borderRadius: 'var(--radius)',
                            borderColor: 'var(--border)',
                            color: 'var(--text-muted)',
                            textTransform: 'none',
                            '&:hover': { borderColor: 'var(--primary)', color: 'var(--primary)', background: 'var(--primary-light)' },
                        }}
                    >
                        Logout
                    </Button>
                </Stack>
            </Box>

            <Card
                sx={{
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: 'var(--shadow)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
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
                            <Typography variant="h6" sx={{ fontWeight: 600, color: 'var(--text)' }}>
                                Welcome back, {user?.name || 'User'}
                            </Typography>
                            <Chip
                                label={roleLabel}
                                size="small"
                                sx={{ mt: 0.5, background: 'var(--primary-light)', color: 'var(--primary)', fontWeight: 500 }}
                            />
                        </Box>
                    </Stack>

                    <Typography variant="body2" sx={{ color: 'var(--text-muted)', mb: 3 }}>
                        Pick a workspace to continue.
                    </Typography>

                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5}>
                        {(role === 'merchant' || role === 'admin' || role === 'developer') && (
                            <Button variant="contained" onClick={() => navigate('/merchant/slots')}>
                                Manage Slots
                            </Button>
                        )}
                        {role === 'agent' && (
                            <Button variant="contained" onClick={() => navigate('/agent/referrals')}>
                                Open Referrals
                            </Button>
                        )}
                        <Button variant="outlined" onClick={() => navigate('/slots')}>
                            Browse Public Slots
                        </Button>
                    </Stack>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Dashboard;
