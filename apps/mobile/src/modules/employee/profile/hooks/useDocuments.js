import { useEffect } from 'react';
import { useProfileStore } from '@/modules/employee/profile/store/profileStore';

export function useDocuments() {
  const { documents, isLoading, error, fetchDocuments } = useProfileStore();

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  return {
    documents,
    isLoading,
    error,
    refreshDocuments: fetchDocuments,
  };
}
