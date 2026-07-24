import { useEffect } from 'react';
import { useCommunicationStore } from '../store/communicationStore';

export const useCommunicationTemplates = () => {
  const { templates, isLoading, error, fetchTemplates } = useCommunicationStore();

  useEffect(() => {
    fetchTemplates();
  }, []);

  return { templates, isLoading, error, fetchTemplates };
};
