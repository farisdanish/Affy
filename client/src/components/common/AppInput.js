import React from 'react';
import { TextField } from '@mui/material';

const AppInput = ({ sx = {}, ...props }) => (
    <TextField
        fullWidth
        InputLabelProps={{
            sx: {
                color: 'var(--text-muted)',
                '&.Mui-focused': { color: 'var(--primary)' },
            },
            ...(props.InputLabelProps || {}),
        }}
        sx={{
            '& .MuiInputBase-input': {
                color: 'var(--text)',
                '&::placeholder': {
                    color: 'var(--text-muted)',
                    opacity: 1,
                },
            },
            '& .MuiSvgIcon-root': {
                color: 'var(--text-muted)',
            },
            '& .MuiOutlinedInput-root': {
                borderRadius: 'var(--radius)',
                color: 'var(--text)',
                background: 'var(--bg-card)',
                '& fieldset': { borderColor: 'var(--border)' },
                '&:hover fieldset': { borderColor: 'var(--primary)' },
                '&.Mui-focused fieldset': { borderColor: 'var(--primary)' },
            },
            ...sx,
        }}
        {...props}
    />
);

export default AppInput;
