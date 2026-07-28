import { apiClient } from '@/api/client/apiClient';

export const offerService = {
  getOffers: async () => {
    const response = await apiClient.get('/hr/recruitment/offers');
    return response?.data || response;
  },

  createOffer: async (offerData) => {
    const response = await apiClient.post('/hr/recruitment/offers', offerData);
    return response?.data || response;
  },

  updateOfferStatus: async (offerId, newStatus) => {
    const response = await apiClient.put(`/hr/recruitment/offers/${offerId}/status`, { status: newStatus });
    return response?.data || response;
  },

  submitHiringDecision: async (decisionData) => {
    const response = await apiClient.post('/hr/recruitment/offers/decisions', decisionData);
    return response?.data || response;
  },
};
