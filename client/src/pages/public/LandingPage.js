import React from 'react';
import { Box, Grid, Stack, Typography, CardContent, Divider } from '@mui/material';
import { Navigate, Link as RouterLink } from 'react-router-dom';
import { Store, Users, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import { AppButton, AppCard } from '../../components/common';
import { useAuth } from '../../context/AuthContext';

const merchantWins = [
    'Publish offer slots with rules, pricing, and availability in minutes.',
    'Route qualified affiliates to the right merchants automatically.',
    'Track bookings, acceptance, and payouts without spreadsheet chaos.',
];

const affiliateWins = [
    'Browse verified merchant offers with clear expectations.',
    'Get fast booking confirmation and transparent next steps.',
    'Build repeatable income with a dashboard that keeps you on track.',
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
                                <ShieldCheck size={16} color="var(--primary)" />
                                <Typography variant="body2" sx={{ color: 'var(--text-muted)', fontWeight: 600 }}>
                                    Built for merchants and affiliates
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
                                    Sell more with affiliates who are ready to act.
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
                                    Affy helps merchants launch affiliate offers faster and helps affiliates find
                                    opportunities they can book and deliver on. Clear workflows, fewer drop-offs,
                                    better outcomes for both sides.
                                </Typography>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                                <AppButton
                                    component={RouterLink}
                                    to="/register"
                                    endIcon={ArrowRight}
                                    sx={{ minWidth: 180, justifyContent: 'center' }}
                                >
                                    Merchant: list offers
                                </AppButton>
                                <AppButton
                                    component={RouterLink}
                                    to="/slots"
                                    variant="outlined"
                                    sx={{ minWidth: 180, justifyContent: 'center' }}
                                >
                                    Affiliate: find offers
                                </AppButton>
                            </Stack>

                            <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ color: 'var(--text-muted)' }}>
                                <Typography variant="body2">Merchant control</Typography>
                                <Typography variant="body2">Affiliate quality</Typography>
                                <Typography variant="body2">Booking clarity</Typography>
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
                                            Marketplace snapshot
                                        </Typography>
                                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                                            Match offers with the right affiliates
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
                                                        Live merchant offers
                                                    </Typography>
                                                    <Typography variant="h4" sx={{ fontWeight: 800 }}>
                                                        128
                                                    </Typography>
                                                </Stack>
                                                <Store color="var(--primary)" />
                                            </Stack>
                                            <Typography variant="caption" sx={{ color: 'var(--text-muted)' }}>
                                                Affy keeps availability and payout expectations in sync.
                                            </Typography>
                                        </Box>

                                        <Stack spacing={1.5}>
                                            <Stack direction="row" alignItems="center" justifyContent="space-between">
                                                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                                    Affiliate acceptance
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
                                                    Offer fill rate
                                                </Typography>
                                                <Typography variant="body2" sx={{ fontWeight: 700 }}>
                                                    81%
                                                </Typography>
                                            </Stack>
                                        </Stack>
                                    </Stack>
                                </Stack>
                            </CardContent>
                        </AppCard>
                    </Grid>
                </Grid>

                {/* Persona value props */}
                <Box sx={{ mt: { xs: 6, md: 8 } }}>
                    <Stack spacing={1} sx={{ mb: 3 }}>
                        <Typography variant="overline" sx={{ color: 'var(--text-muted)', letterSpacing: 1 }}>
                            Two sides, one system
                        </Typography>
                        <Typography variant="h5" sx={{ fontWeight: 700 }}>
                            Affy is built to help merchants sell and affiliates earn.
                        </Typography>
                    </Stack>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={6}>
                            <AppCard
                                sx={{
                                    height: '100%',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    boxShadow: 'var(--shadow)',
                                }}
                            >
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
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
                                                <Store color="var(--primary)" size={20} />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                For merchants
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                            Launch affiliate offers without losing control. You decide the rules,
                                            availability, and who gets access.
                                        </Typography>
                                        <Stack spacing={1.2}>
                                            {merchantWins.map((item) => (
                                                <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                                                    <CheckCircle2 size={16} color="var(--primary)" />
                                                    <Typography variant="body2">{item}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                        <AppButton component={RouterLink} to="/register" endIcon={ArrowRight}>
                                            Create merchant workspace
                                        </AppButton>
                                    </Stack>
                                </CardContent>
                            </AppCard>
                        </Grid>
                        <Grid item xs={12} md={6}>
                            <AppCard
                                sx={{
                                    height: '100%',
                                    border: '1px solid var(--border)',
                                    background: 'var(--bg-card)',
                                    boxShadow: 'var(--shadow)',
                                }}
                            >
                                <CardContent>
                                    <Stack spacing={2}>
                                        <Stack direction="row" spacing={1.5} alignItems="center">
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
                                                <Users color="var(--primary)" size={20} />
                                            </Box>
                                            <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                                For affiliates
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                            Find high-quality merchants fast. Accept clear offers, book slots, and
                                            execute with confidence.
                                        </Typography>
                                        <Stack spacing={1.2}>
                                            {affiliateWins.map((item) => (
                                                <Stack key={item} direction="row" spacing={1} alignItems="flex-start">
                                                    <CheckCircle2 size={16} color="var(--primary)" />
                                                    <Typography variant="body2">{item}</Typography>
                                                </Stack>
                                            ))}
                                        </Stack>
                                        <AppButton component={RouterLink} to="/slots" variant="outlined" endIcon={ArrowRight}>
                                            Browse merchant offers
                                        </AppButton>
                                    </Stack>
                                </CardContent>
                            </AppCard>
                        </Grid>
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
                                Connect merchants and affiliates with less friction.
                            </Typography>
                        </Stack>
                        <Grid container spacing={2}>
                            {['List offers', 'Match affiliates', 'Close the loop'].map((step, index) => (
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
                                                'Merchants set availability, payouts, and guardrails for every offer.',
                                                'Affiliates claim the right offers, with clear timelines and expectations.',
                                                'Track outcomes, approve payouts, and reuse what converts.',
                                            ][index]}
                                        </Typography>
                                    </Stack>
                                </Grid>
                            ))}
                        </Grid>
                        <Divider sx={{ borderColor: 'var(--border)' }} />
                        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                            <AppButton component={RouterLink} to="/register" endIcon={ArrowRight}>
                                Start with a merchant workspace
                            </AppButton>
                            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                Want to earn as an affiliate?{' '}
                                <Box
                                    component={RouterLink}
                                    to="/login"
                                    sx={{ color: 'var(--primary)', fontWeight: 700 }}
                                >
                                    Join and browse offers
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
