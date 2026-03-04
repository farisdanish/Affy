import React from 'react';
import { Dialog, DialogActions, DialogContent, DialogTitle, Typography } from '@mui/material';
import AppButton from './AppButton';

const ConfirmDialog = ({
    open,
    title = 'Confirm action',
    description = 'Are you sure you want to continue?',
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onClose,
    loading = false,
}) => (
    <Dialog
        open={open}
        onClose={onClose}
        PaperProps={{
            sx: {
                borderRadius: 'var(--radius)',
                border: '1px solid var(--border)',
                background: 'var(--bg-card)',
                color: 'var(--text)',
            },
        }}
    >
        <DialogTitle>{title}</DialogTitle>
        <DialogContent>
            <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                {description}
            </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
            <AppButton variant="outlined" onClick={onClose} disabled={loading}>
                {cancelText}
            </AppButton>
            <AppButton onClick={onConfirm} disabled={loading}>
                {loading ? 'Processing...' : confirmText}
            </AppButton>
        </DialogActions>
    </Dialog>
);

export default ConfirmDialog;
