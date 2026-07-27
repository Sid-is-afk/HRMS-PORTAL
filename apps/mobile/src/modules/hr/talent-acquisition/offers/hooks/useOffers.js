import { useEffect } from 'react';
import { useOfferStore } from '../store/offerStore';
import { offerService } from '../services/offerService';

export function useOffers() {
  const { offers, isLoading, error, setOffers, setLoading, setError, searchQuery, filterStatus } = useOfferStore();

  const fetchOffers = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await offerService.getOffers();
      setOffers(data);
    } catch (err) {
      setError(err.message || 'Failed to fetch offers');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffers();
  }, []);

  const filteredOffers = offers.filter(offer => {
    const matchesSearch = offer.candidate_name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          offer.job_title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = filterStatus === 'all' || offer.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  return { offers: filteredOffers, isLoading, error, fetchOffers, allOffers: offers };
}
