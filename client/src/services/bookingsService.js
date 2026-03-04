import api from './api';

export const createBooking = async (payload) => {
    const response = await api.post('/bookings', payload);
    return response.data;
};
