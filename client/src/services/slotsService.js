import api from './api';

export const getPublicSlots = async () => {
    const response = await api.get('/slots/public');
    return response.data;
};

export const getMySlots = async () => {
    const response = await api.get('/slots/mine');
    return response.data;
};

export const createSlot = async (payload) => {
    const response = await api.post('/slots', payload);
    return response.data;
};

export const updateSlot = async (slotId, payload) => {
    const response = await api.put(`/slots/${slotId}`, payload);
    return response.data;
};

export const deactivateSlot = async (slotId) => {
    const response = await api.delete(`/slots/${slotId}`);
    return response.data;
};
