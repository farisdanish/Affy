import api from './api';

export const getMyRefCode = async () => {
    const response = await api.get('/api/v1/referrals/my-code');
    return response.data;
};

export const generateReferralLink = async (slotId) => {
    const response = await api.post('/api/v1/referrals/link', { slotId });
    return response.data;
};
