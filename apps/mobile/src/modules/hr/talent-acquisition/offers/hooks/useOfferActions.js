import { useOfferStore } from '../store/offerStore';
import { offerService } from '../services/offerService';

export function useOfferActions() {
  const { addOffer, updateOffer, addHiringDecision, setLoading, setError } = useOfferStore();

  const createOffer = async (data) => {
    try {
      setLoading(true);
      const newOffer = await offerService.createOffer(data);
      addOffer(newOffer);
      return newOffer;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const changeOfferStatus = async (offerId, status) => {
    try {
      setLoading(true);
      const updated = await offerService.updateOfferStatus(offerId, status);
      updateOffer(updated);
      return updated;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const makeHiringDecision = async (decisionData) => {
    try {
      setLoading(true);
      const decision = await offerService.submitHiringDecision(decisionData);
      addHiringDecision(decision);
      return decision;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return { createOffer, changeOfferStatus, makeHiringDecision };
}
