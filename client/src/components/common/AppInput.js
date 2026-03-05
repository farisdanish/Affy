import React from 'react';
import { TextField } from '@mui/material';

const AppInput = ({ sx = {}, ...props }) => (
    <TextField
        fullWidth
        InputLabelProps={{
            sx: {
                color: 'text.secondary',
                '&.Mui-focused': { color: 'primary.main' },
            },
            ...(props.InputLabelProps || {}),
        }}
        sx={{
            '& .MuiInputBase-input': {
                color: 'text.primary',
                '&::placeholder': {
                    color: 'text.secondary',
                    opacity: 1,
                },
            },
            '& .MuiSvgIcon-root': {
                color: 'text.secondary',
            },
            '& .MuiOutlinedInput-root': {
                borderRadius: '12px',
                color: 'text.primary',
                background: 'background.paper',
                '& fieldset': { borderColor: 'divider' },
                '&:hover fieldset': { borderColor: 'primary.main' },
                '&.Mui-focused fieldset': { borderColor: 'primary.main' },
            },
            ...sx,
        }}
        {...props}
    />
);

export default AppInput;
