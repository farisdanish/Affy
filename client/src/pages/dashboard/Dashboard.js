import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import {
    Box,
    Grid,
    Stack,
    Typography,
    Container,
    ThemeProvider,
    CssBaseline
} from '@mui/material';
import {
    LayoutDashboard,
    LogOut,
    Calendar,
    Users,
    Link as LinkIcon,
    TrendingUp,
    ChevronRight
} from 'lucide-react';
import {
    AppButton,
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
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const role = user?.role || 'user';
    const roleLabel = role.charAt(0).toUpperCase() + role.slice(1);

    const theme = ['admin', 'merchant', 'developer'].includes(role) ? adminTheme : publicTheme;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

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
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <Box sx={{ minHeight: '100vh', bgcolor: 'background.default', color: 'text.primary', pb: 8 }}>
                {/* Header */}
                <Box
                    sx={{
                        borderBottom: 1,
                        borderColor: 'divider',
                        bgcolor: 'background.paper',
                        py: 2,
                        mb: 4
                    }}
                >
                    <Container maxWidth="lg">
                        <Stack direction="row" justifyContent="space-between" alignItems="center" spacing={1.5}>
                            <Stack direction="row" spacing={1.5} alignItems="center">
                                <Box sx={{ color: 'primary.main', display: 'flex' }}>
                                    <LayoutDashboard size={28} />
                                </Box>
                                <Typography variant="h5" sx={{ fontWeight: 800, letterSpacing: '-0.5px' }}>
                                    Affy
                                </Typography>
                            </Stack>

                            <Stack direction="row" spacing={1} alignItems="center">
                                <AppButton
                                    variant="outlined"
                                    size="small"
                                    onClick={handleLogout}
                                    startIcon={LogOut}
                                    sx={{ borderRadius: '10px', display: { xs: 'none', sm: 'inline-flex' } }}
                                >
                                    Logout
                                </AppButton>
                            </Stack>
                        </Stack>
                    </Container>
                </Box>

                <Container maxWidth="lg" sx={{ px: { xs: 0, sm: 2, md: 3 } }}>
                    {/* Welcome Section */}
                    <Box sx={{ mb: 4, px: { xs: 2, sm: 0 } }}>
                        <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 1 }}>
                            <AppAvatar name={user?.name} size={56} />
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, lineHeight: 1.15 }}>
                                    Hello, {user?.name?.split(' ')[0] || 'User'}!
                                </Typography>
                                <Stack direction="row" spacing={1} alignItems="center">
                                    <AppBadge label={roleLabel} color="primary" size="sm" />
                                    <Typography variant="body2" color="text.secondary">
                                        Welcome to your workspace dashboard.
                                    </Typography>
                                </Stack>
                            </Box>
                        </Stack>
                    </Box>

                    {/* Stats Grid - Visible only to privileged roles */}
                    {['admin', 'merchant', 'developer'].includes(role) && (
                        <Grid
                            container
                            columnSpacing={{ xs: 0, sm: 2, md: 3 }}
                            rowSpacing={{ xs: 2, md: 3 }}
                            sx={{ mb: 5 }}
                        >
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard label="Total Bookings" value="128" icon={Calendar} trend={12} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard label="Active Referrals" value="45" icon={LinkIcon} color="success" trend={8} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard label="New Users" value="2,420" icon={Users} color="info" trend={-3} />
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <StatsCard label="Revenue" value="$12.4k" icon={TrendingUp} color="primary" trend={24} />
                            </Grid>
                        </Grid>
                    )}

                    {/* Quick Actions */}
                    <Typography variant="h6" sx={{ fontWeight: 700, mb: 2, px: { xs: 2, sm: 0 } }}>
                        Quick Actions
                    </Typography>
                    <Grid
                        container
                        columnSpacing={{ xs: 2, md: 3 }}
                        rowSpacing={{ xs: 2, md: 3 }}
                        sx={{ px: { xs: 2, sm: 0 } }}
                    >
                        {getRoleActions().map((action, idx) => {
                            const tone = actionTones[action.color] || actionTones.primary;
                            return (
                                <Grid item xs={12} md={4} key={idx}>
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
            </Box>
        </ThemeProvider>
    );
};

export default Dashboard;
