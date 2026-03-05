import React from 'react';
import { Box, Typography, Stack } from '@mui/material';
import AppCard from './AppCard';

const StatsCard = ({ label, value, icon: Icon, trend, color = 'primary' }) => {
    const getColor = () => {
        const colors = {
            primary: 'primary.main',
            success: '#16a34a',
            error: '#dc2626',
            info: '#2563eb',
        };
        return colors[color] || colors.primary;
    };

    return (
        <AppCard
            sx={{
                p: 2.5,
                minHeight: 132,
                height: '100%',
                display: 'flex',
                alignItems: 'center',
            }}
        >
            <Stack direction="row" spacing={2} alignItems="center" sx={{ width: '100%' }}>
                <Box
                    sx={{
                        width: 48,
                        height: 48,
                        borderRadius: '12px',
                        background: `${getColor()}15`, // Add alpha for soft bg
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: getColor(),
                    }}
                >
                    {Icon && <Icon size={24} />}
                </Box>
                <Box>
                    <Typography
                        variant="body2"
                        sx={{ color: 'text.secondary', fontWeight: 500, whiteSpace: 'nowrap' }}
                    >
                        {label}
                    </Typography>
                    <Stack direction="row" spacing={1} alignItems="baseline" sx={{ flexWrap: 'nowrap' }}>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: 'text.primary', lineHeight: 1.1, whiteSpace: 'nowrap' }}
                        >
                            {value}
                        </Typography>
                        {trend && (
                            <Typography 
                                variant="caption" 
                                sx={{ 
                                    color: trend > 0 ? '#16a34a' : '#dc2626',
                                    fontWeight: 600
                                }}
                            >
                                {trend > 0 ? '+' : ''}{trend}%
                            </Typography>
                        )}
                    </Stack>
                </Box>
            </Stack>
        </AppCard>
    );
};

export default StatsCard;
