import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { register } from '../../services/authService';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Alert,
    CircularProgress,
    MenuItem,
} from '@mui/material';
import { UserPlus } from 'lucide-react';
import { REGISTRABLE_ROLES } from '../../config/roles';



const inputSx = {
    mb: 2,
    '& .MuiOutlinedInput-root': {
        borderRadius: 'var(--radius)',
        color: 'var(--text)',
        '& fieldset': { borderColor: 'var(--border)' },
        '&:hover fieldset': { borderColor: 'var(--primary)' },
        '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
    },
    '& .MuiInputLabel-root': { color: 'var(--text-muted)' },
    '& .MuiInputLabel-root.Mui-focused': { color: 'var(--primary)' },
    '& .MuiSvgIcon-root': { color: 'var(--text-muted)' },
};

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('user');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            await register(name, email, password, role);
            navigate('/login', { state: { registered: true } });
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'var(--bg)',
                padding: 3,
            }}
        >
            <Card
                sx={{
                    maxWidth: 420,
                    width: '100%',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--border)',
                    borderRadius: 'var(--radius)',
                    boxShadow: '0 4px 24px rgba(99, 102, 241, 0.1)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Box
                            sx={{
                                width: 56,
                                height: 56,
                                borderRadius: '50%',
                                background: 'rgba(99, 102, 241, 0.15)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mx: 'auto',
                                mb: 2,
                            }}
                        >
                            <UserPlus size={28} color="#6366f1" />
                        </Box>
                        <Typography
                            variant="h5"
                            sx={{ fontWeight: 700, color: 'var(--text)', fontFamily: 'Inter, sans-serif' }}
                        >
                            Create an Account
                        </Typography>
                        <Typography
                            variant="body2"
                            sx={{ color: 'var(--text-muted)', mt: 0.5 }}
                        >
                            Join Affy to get started
                        </Typography>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2, borderRadius: 'var(--radius)' }}>
                            {error}
                        </Alert>
                    )}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField
                            id="register-name"
                            label="Full Name"
                            fullWidth
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            sx={inputSx}
                        />
                        <TextField
                            id="register-email"
                            label="Email"
                            type="email"
                            fullWidth
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            sx={inputSx}
                        />
                        <TextField
                            id="register-password"
                            label="Password"
                            type="password"
                            fullWidth
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            sx={inputSx}
                        />
                        <TextField
                            id="register-role"
                            label="I am a..."
                            select
                            fullWidth
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            sx={{ ...inputSx, mb: 3 }}
                        >
                            {REGISTRABLE_ROLES.map((option) => (
                                <MenuItem key={option.value} value={option.value}>
                                    {option.label}
                                </MenuItem>
                            ))}
                        </TextField>
                        <Button
                            id="register-submit"
                            type="submit"
                            fullWidth
                            variant="contained"
                            disabled={loading}
                            sx={{
                                py: 1.5,
                                borderRadius: 'var(--radius)',
                                background: 'var(--primary)',
                                fontWeight: 600,
                                fontFamily: 'Inter, sans-serif',
                                textTransform: 'none',
                                fontSize: '1rem',
                                '&:hover': { background: 'var(--primary-hover)' },
                            }}
                        >
                            {loading ? <CircularProgress size={24} color="inherit" /> : 'Create Account'}
                        </Button>
                    </Box>

                    <Typography
                        variant="body2"
                        sx={{ textAlign: 'center', mt: 3, color: 'var(--text-muted)' }}
                    >
                        Already have an account?{' '}
                        <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 500 }}>
                            Sign in
                        </Link>
                    </Typography>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Register;
