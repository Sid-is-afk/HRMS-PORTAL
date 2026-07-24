import { useEffect } from 'react';
import { useCommunicationStore } from '../store/communicationStore';

export const useAudienceSelector = (audienceFilter) => {
  const { audiencePreview, isLoading, error, fetchAudiencePreview } = useCommunicationStore();

  useEffect(() => {
    if (audienceFilter) {
      fetchAudiencePreview(audienceFilter);
    }
  }, [JSON.stringify(audienceFilter)]);

  return { audiencePreview, isLoading, error };
};
