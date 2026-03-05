import { createTheme } from '@mui/material/styles';

// 1. Admin Theme (Refining the dark mode)
export const adminTheme = createTheme({
    palette: {
        mode: 'dark',
        background: {
            default: '#0f0f13', // Deep dark background
            paper: '#1a1a20',   // Slightly lighter for cards
        },
        primary: {
            main: '#6366f1', // Purple accent
        },
        success: {
            main: '#22c55e', // Positive metrics
        }
    },
    components: {
        MuiCard: {
            styleOverrides: {
                root: {
                    borderRadius: 16,
                    border: '1px solid rgba(255, 255, 255, 0.05)',
                    backgroundImage: 'none', // removes default MUI elevation styling
                },
            },
        },
    },
});

// 2. Public Theme (Inviting, light, conversion-focused)
export const publicTheme = createTheme({
    palette: {
        mode: 'light',
        background: {
            default: '#f8fafc', // Soft grey/blue background
            paper: '#ffffff',
        },
        primary: {
            main: '#4f46e5', // Darker purple for contrast
        },
        secondary: {
            main: '#ec4899', // Secondary color
        }
    },
    components: {
        MuiButton: {
            styleOverrides: {
                root: {
                    borderRadius: 8,
                    textTransform: 'none',
                    fontWeight: 600,
                },
            },
        },
    },
});
