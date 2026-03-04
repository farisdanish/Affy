import api from './api';

export const getMyRefCode = async () => {
    const response = await api.get('/referrals/my-code');
    return response.data;
};

export const generateReferralLink = async (slotId) => {
    const response = await api.post('/referrals/link', { slotId });
    return response.data;
};
