import React from 'react';
import { Box, Grid, Stack, Typography, CardContent, Divider } from '@mui/material';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { Sparkles, ShieldCheck, Gauge, CalendarCheck, ArrowRight } from 'lucide-react';
import { AppButton, AppCard } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

const features = [
    {
        title: 'Unified scheduling',
        description: 'Publish merchant slots with guardrails, track bookings, and keep everyone on the same cadence.',
        icon: CalendarCheck,
    },
    {
        title: 'Role-aware journeys',
        description: 'Admin, merchant, agent, and public users see the right layout, actions, and protections by default.',
        icon: ShieldCheck,
    },
    {
        title: 'Conversion clarity',
        description: 'Pipeline-style stats and alerts so you spot friction before it hurts revenue.',
        icon: Gauge,
    },
];

const LandingPage = () => {
    const { isAuthenticated, loading } = useAuth();

    if (loading) return null;
    if (isAuthenticated) return <Navigate to="/dashboard" replace />;

    return (
        <Box
            sx={{
                position: 'relative',
                overflow: 'hidden',
                color: 'var(--text)',
                '&::before': {
                    content: '""',
                    position: 'absolute',
                    width: 420,
                    height: 420,
                    top: -120,
                    left: -80,
                    background: 'radial-gradient(circle at 30% 30%, var(--primary-light), transparent 60%)',
                    filter: 'blur(30px)',
                    opacity: 0.8,
                },
                '&::after': {
                    content: '""',
                    position: 'absolute',
                    width: 460,
                    height: 460,
                    bottom: -160,
                    right: -120,
                    background: 'radial-gradient(circle at 30% 30%, var(--primary-light), transparent 60%)',
                    filter: 'blur(38px)',
                    opacity: 0.8,
                },
            }}
        >
            <Box sx={{ maxWidth: 1200, mx: 'auto', py: { xs: 6, md: 8 } }}>
                {/* Hero */}
                <Grid container spacing={{ xs: 4, md: 6 }} alignItems="center">
                    <Grid item xs={12} md={7}>
                        <Stack spacing={2.5}>
                            <Box
                                sx={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 1,
                                    borderRadius: 999,
                                    background: 'var(--primary-light)',
                                    border: '1px solid var(--border)',
                                    width: 'fit-content',
                                }}
                            >
                                <Sparkles size={16} color="var(--primary)" />
                                <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Affiliate ops that ship fast
                                </Typography>
                            </Box>

                            <Stack spacing={1.5}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                        fontSize: 'clamp(2.25rem, 4vw, 3.5rem)',
                                        letterSpacing: '-0.5px',
                                    }}
                                >
                                    Affy keeps your affiliate workflows crisp, measurable, and launch-ready.
                                </Typography>
                                <Typography
                                    variant="h6"
                                    sx={{
                                        color: 'var(--text-muted)',
                                        maxWidth: 680,
                                        fontWeight: 500,
                                        fontSize: 'clamp(1rem, 2.2vw, 1.2rem)',
                                    }}
                                >
                                    Publish slots, onboard partners, and enforce role-based guardrails without slowing
                                    down go-to-market. Built for teams that need clarity and speed.
                                </Typography>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <AppButton
                                    component={RouterLink}
                                    to="/register"
                                    endIcon={ArrowRight}
                                    sx={{ minWidth: 180, justifyContent: 'center' }}
                                >
                                    Create an account
                                </AppButton>
                                <AppButton
                                    component={RouterLink}
                                    to="/slots"
                                    variant="outlined"
                                    sx={{ minWidth: 180, justifyContent: 'center' }}
                                >
                                    Browse slots
                                </AppButton>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ color: 'var(--text-muted)' }}>
                                <Typography variant="body2">Role-aware layouts</Typography>
                                <Typography variant="body2">Built-in booking flows</Typography>
                                <Typography variant="body2">Light + dark ready</Typography>
                            </Stack>
                        </Stack>
                    </Grid>

                    <Grid item xs={12} md={5}>
                        <AppCard
                            sx={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border)',
                                boxShadow: 'var(--shadow)',
                                backdropFilter: 'blur(12px)',
                            }}
                        >
                            <CardContent>
                                <Stack spacing={3}>
                                    <Stack spacing={0.5}>
                                        <Typography variant="overline" sx={{ color: 'var(--text-muted)', letterSpacing: 1 }}>
                                            Workspace snapshot
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Real-time insight for every role
                                        </Typography>
                                    </Stack>

                                    <Stack spacing={2}>
                                        <Box
                                            sx={{
                                                p: 2,
                                                borderRadius: '14px',
                                                background: 'var(--primary-light)',
                                                border: '1px solid var(--border)',
                                            }}
                                        >
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Stack spacing={0.5}>
                                                    <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                                        Active slots
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                                        128
                                                    </Typography>
                                                </Stack>
                                                <Sparkles color="var(--primary)" />
                                            </Stack>
                                            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                                Routing leads to merchants with SLA-aware notifications.
                                            </Typography>
                                        </Box>

                                        <Stack spacing={1.5}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                                    Agent acceptance
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    93%
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                                    Time to book
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    4m 12s
                                                </Typography>
                                            </Stack>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                                    Conversion lift
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    +18%
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </AppCard>
                    </Grid>
                </Grid>

                {/* Feature grid */}
                <Box sx={{ mt: { xs: 6, md: 8 } }}>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                        <Typography variant="overline" sx={{ color: 'var(--text-muted)', letterSpacing: 1 }}>
                            Why Affy
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Built for operators who need clarity and velocity.
                        </Typography>
                    </Stack>
                    <Grid container spacing={3}>
                        {features.map(({ title, description, icon: Icon }) => (
                            <Grid item xs={12} md={4} key={title}>
                                <AppCard
                                    sx={{
                                        height: '100%',
                                        border: '1px solid var(--border)',
                                        background: 'var(--bg-card)',
                                        boxShadow: 'none',
                                        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                                        '&:hover': { transform: 'translateY(-4px)', boxShadow: 'var(--shadow)' },
                                    }}
                                >
                                    <CardContent>
                                        <Stack spacing={1.5}>
                                            <Box
                                                sx={{
                                                    width: 44,
                                                    height: 44,
                                                    borderRadius: '12px',
                                                    display: 'grid',
                                                    placeItems: 'center',
                                                    background: 'var(--primary-light)',
                                                }}
                                            >
                                                <Icon color="var(--primary)" size={20} />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                {title}
                                            </Typography>
                                            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                                {description}
                                            </Typography>
                                        </Stack>
                                    </CardContent>
                                </AppCard>
                            </Grid>
                        ))}
                    </Grid>
                </Box>

                {/* How it works */}
                <Box
                    sx={{
                        mt: { xs: 6, md: 8 },
                        p: { xs: 3, md: 4 },
                        borderRadius: '16px',
                        background: 'linear-gradient(135deg, var(--bg-card), var(--primary-light))',
                        border: '1px solid var(--border)',
                        boxShadow: 'var(--shadow)',
                    }}
                >
                    <Stack spacing={3}>
                        <Stack spacing={1}>
                            <Typography variant="overline" sx={{ color: 'var(--text-muted)' }}>
                                How it works
                            </Typography>
                            <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                Launch an affiliate-ready workspace in minutes.
                            </Typography>
                        </Stack>
                        <Grid container spacing={2}>
                            {['Publish slots', 'Invite partners', 'Track outcomes'].map((step, index) => (
                                <Grid item xs={12} md={4} key={step}>
                                    <Stack spacing={1.5}>
                                        <Box
                                            sx={{
                                                width: 36,
                                                height: 36,
                                                borderRadius: '10px',
                                                display: 'grid',
                                                placeItems: 'center',
                                                background: 'var(--primary-light)',
                                                color: 'var(--primary)',
                                                fontWeight: 700,
                                            }}
                                        >
                                            {index + 1}
                                        </Box>
                                        <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                                            {step}
                                        </Typography>
                                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                            {[
                                                'Create or import merchant slots with pricing and availability in one place.',
                                                'Assign roles, share access links, and keep guardrails consistent across teams.',
                                                'Monitor booking velocity, agent acceptance, and payout readiness in real time.',
                                            ][index]}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <Divider sx={{ borderColor: 'var(--border)' }} />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                            <AppButton component={RouterLink} to="/register" endIcon={ArrowRight}>
                                Start now
                            </AppButton>
                            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                Already collaborating?{' '}
                                <Box
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ color: 'var(--primary)', fontWeight: 700 }}
                                >
                                    Log in
                                </Box>
                            </Typography>
                        </Stack>
                    </Stack>
                </Box>
            </Box>
        </Box>
    );
};

export default LandingPage;
