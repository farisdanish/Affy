import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import statsService from '../../services/statsService';
import {
    Box,
    Grid,
    Stack,
    Typography,
    Container,
    CircularProgress
} from '@mui/material';
import {
    Calendar,
    Users,
    Link as LinkIcon,
    TrendingUp,
    ChevronRight
} from 'lucide-react';
import {
    AppCard,
    StatsCard,
    AppAvatar,
    AppBadge
} from '../../components/common';
import { adminTheme, publicTheme } from '../../theme';

const actionTones = {
    primary: { icon: 'primary.main', bg: 'primary.light' },
    success: { icon: '#16a34a', bg: 'rgba(34, 197, 94, 0.12)' },
    info: { icon: '#2563eb', bg: 'rgba(59, 130, 246, 0.12)' },
};

const Dashboard = () => {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);

    const role = user?.role || 'user';
    const isPrivileged = ['admin', 'merchant', 'developer'].includes(role);

    useEffect(() => {
        if (isPrivileged) {
            const fetchStats = async () => {
                setLoading(true);
                try {
                    const data = await statsService.getStats();
                    setStats(data);
                } catch (err) {
                    console.error('Failed to fetch dashboard stats');
                } finally {
                    setLoading(false);
                }
            };
            fetchStats();
        }
    }, [isPrivileged]);

    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

    const theme = ['admin', 'merchant', 'developer'].includes(role) ? adminTheme : publicTheme;

    const getRoleActions = () => {
        const actions = [];
        if (role === 'merchant' || role === 'admin' || role === 'developer') {
            actions.push({
                title: 'Manage Slots',
                description: 'Create and update your booking slots.',
                icon: Calendar,
                path: '/workspace/slots',
                color: 'primary'
            });
        }
        if (role === 'agent') {
            actions.push({
                title: 'Referral Dashboard',
                description: 'Generate links and track your performance.',
                icon: LinkIcon,
                path: '/agent/referrals',
                color: 'success'
            });
        }
        actions.push({
            title: 'Browse Slots',
            description: 'View available slots in the catalog.',
            icon: Users,
            path: '/slots',
            color: 'info'
        });
        return actions;
    };

    return (
        <Container maxWidth="lg" sx={{ px: { xs: 2, sm: 3 }, pb: 8 }}>
            {/* Welcome Section Hero */}
            <Box
                sx={{
                    mb: 5,
                    p: { xs: 3, md: 4 },
                    borderRadius: '24px',
                    background: theme.palette.mode === 'dark'
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.12) 0%, rgba(0,0,0,0) 100%)'
                        : 'linear-gradient(135deg, #eef2ff 0%, #ffffff 100%)',
                    border: '1px solid',
                    borderColor: theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.05)' : '#e0e7ff',
                    boxShadow: theme.palette.mode === 'light' ? '0 10px 40px -10px rgba(79, 70, 229, 0.1)' : 'none'
                }}
            >
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={3} alignItems={{ xs: 'flex-start', sm: 'center' }}>
                    <AppAvatar name={user?.name} size={72} />
                    <Box>
                        <Typography variant="h4" sx={{ fontWeight: 800, mb: 0.5, letterSpacing: '-0.5px' }}>
                            Welcome back, {user?.name?.split(' ')[0] || 'User'}!
                        </Typography>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ mt: 1 }}>
                            <AppBadge label={roleLabel} color="primary" size="md" />
                            <Typography variant="body1" color="text.secondary">
                                Ready to manage your workspace and discover new opportunities?
                            </Typography>
                        </Stack>
                    </Box>
                </Stack>
            </Box>

            {/* Stats Grid - Visible only to privileged roles */}
            {isPrivileged && (
                <Box sx={{ mb: 5, minHeight: 120, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    {loading ? (
                        <CircularProgress size={40} thickness={4} />
                    ) : stats ? (
                        <Grid
                            container
                            columnSpacing={{ xs: 0, sm: 2, md: 3 }}
                            rowSpacing={{ xs: 2, md: 3 }}
                        >
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatsCard
                                    label="Total Bookings"
                                    value={stats.totalBookings.toLocaleString()}
                                    icon={Calendar}
                                    trend={12}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatsCard
                                    label="Active Referrals"
                                    value={stats.activeReferrals.toLocaleString()}
                                    icon={LinkIcon}
                                    color="success"
                                    trend={8}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatsCard
                                    label={role === 'merchant' ? 'Unique Customers' : 'New Users'}
                                    value={stats.totalUsers.toLocaleString()}
                                    icon={Users}
                                    color="info"
                                    trend={-3}
                                />
                            </Grid>
                            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                                <StatsCard
                                    label="Revenue"
                                    value={`$${stats.totalRevenue.toLocaleString()}`}
                                    icon={TrendingUp}
                                    color="primary"
                                    trend={24}
                                />
                            </Grid>
                        </Grid>
                    ) : (
                        <Typography color="text.secondary">Failed to load statistics</Typography>
                    )}
                </Box>
            )}


            {/* Quick Actions */}
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
                Quick Actions
            </Typography>
            <Grid
                container
                spacing={3}
            >
                {getRoleActions().map((action, idx) => {
                    const tone = actionTones[action.color] || actionTones.primary;
                    return (
                        <Grid size={{ xs: 12, md: 4 }} key={idx}>
                            <AppCard
                                sx={{
                                    p: { xs: 2.5, md: 3 },
                                    minHeight: { xs: 188, md: 206 },
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s ease, border-color 0.2s ease',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        borderColor: 'primary.main',
                                    }
                                }}
                                onClick={() => navigate(action.path)}
                            >
                                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                    <Box
                                        sx={{
                                            width: 44,
                                            height: 44,
                                            borderRadius: '10px',
                                            background: tone.bg,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: tone.icon,
                                            mb: 2
                                        }}
                                    >
                                        <action.icon size={22} />
                                    </Box>
                                    <ChevronRight size={18} color="action" />
                                </Stack>
                                <Typography
                                    variant="h6"
                                    sx={{ fontWeight: 600, mb: 0.5, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}
                                >
                                    {action.title}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{
                                        minHeight: { xs: 44, md: 48 },
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                    }}
                                >
                                    {action.description}
                                </Typography>
                            </AppCard>
                        </Grid>
                    );
                })}
            </Grid>
        </Container>
    );
};

export default Dashboard;
