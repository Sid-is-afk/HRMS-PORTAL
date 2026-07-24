import { useEffect } from 'react';
import { useCommunicationStore } from '../store/communicationStore';

export const useAnnouncements = (filters = {}) => {
  const { announcements, isLoading, error, fetchAnnouncements } = useCommunicationStore();

  useEffect(() => {
    fetchAnnouncements(filters);
  }, [JSON.stringify(filters)]);

  return { announcements, isLoading, error, fetchAnnouncements };
};
