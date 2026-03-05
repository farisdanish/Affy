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
                borderRadius: '12px', 
                border: '1px solid divider',
                boxShadow: 'none',
                background: 'background.paper',
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
                                    color: 'text.primary',
                                    borderBottom: '1px solid divider',
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
                                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
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
                                            color: 'text.primary',
                                            borderBottom: '1px solid divider',
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
