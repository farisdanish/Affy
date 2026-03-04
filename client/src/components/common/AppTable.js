import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography
} from '@mui/material';

const AppTable = ({ 
    columns, 
    data, 
    emptyMessage = 'No data available',
    onRowClick,
    sx = {}
}) => {
    return (
        <TableContainer 
            component={Paper} 
            sx={{ 
                borderRadius: 'var(--radius)', 
                border: '1px solid var(--border)',
                boxShadow: 'none',
                background: 'var(--bg-card)',
                ...sx 
            }}
        >
            <Table>
                <TableHead sx={{ background: 'rgba(249, 115, 22, 0.04)' }}>
                    <TableRow>
                        {columns.map((column) => (
                            <TableCell 
                                key={column.id}
                                align={column.align || 'left'}
                                sx={{ 
                                    fontWeight: 700, 
                                    color: 'var(--text)',
                                    borderBottom: '1px solid var(--border)',
                                    py: 2
                                }}
                            >
                                {column.label}
                            </TableCell>
                        ))}
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={columns.length} align="center" sx={{ py: 8, border: 'none' }}>
                                <Typography variant="body2" sx={{ color: 'var(--text-muted)' }}>
                                    {emptyMessage}
                                </Typography>
                            </TableCell>
                        </TableRow>
                    ) : (
                        data.map((row, index) => (
                            <TableRow 
                                key={row.id || index}
                                onClick={() => onRowClick && onRowClick(row)}
                                sx={{ 
                                    cursor: onRowClick ? 'pointer' : 'default',
                                    '&:hover': { background: 'rgba(249, 115, 22, 0.02)' },
                                    '&:last-child td': { borderBottom: 'none' }
                                }}
                            >
                                {columns.map((column) => (
                                    <TableCell 
                                        key={column.id}
                                        align={column.align || 'left'}
                                        sx={{ 
                                            color: 'var(--text)',
                                            borderBottom: '1px solid var(--border)',
                                            py: 2
                                        }}
                                    >
                                        {column.render ? column.render(row) : row[column.id]}
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

export default AppTable;
