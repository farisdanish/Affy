import api from './api';

export const getPublicSlots = async () => {
    const response = await api.get('/api/v1/slots/public');
    return response.data;
};

export const getMySlots = async () => {
    const response = await api.get('/api/v1/slots/mine');
    return response.data;
};

export const createSlot = async (payload) => {
    const response = await api.post('/api/v1/slots', payload);
    return response.data;
};

export const updateSlot = async (slotId, payload) => {
    const response = await api.put(`/api/v1/slots/${slotId}`, payload);
    return response.data;
};

export const deactivateSlot = async (slotId) => {
    const response = await api.delete(`/api/v1/slots/${slotId}`);
    return response.data;
};
