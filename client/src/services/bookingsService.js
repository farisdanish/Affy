import api from './api';

export const createBooking = async (payload, refCode) => {
    const response = await api.post('/bookings', payload, {
        params: refCode ? { ref: refCode } : undefined,
    });
    return response.data;
};
