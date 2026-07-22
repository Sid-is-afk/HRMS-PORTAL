import { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export function useWorkflowDetails(id) {
  const { selectedRequest, isLoading, error, loadRequestDetails } = useWorkflowStore((state) => ({
    selectedRequest: state.selectedRequest,
    isLoading: state.isLoading,
    error: state.error,
    loadRequestDetails: state.loadRequestDetails,
  }));

  useEffect(() => {
    if (id) {
      loadRequestDetails(id);
    }
  }, [id, loadRequestDetails]);

  return {
    request: selectedRequest,
    isLoading,
    error,
    refresh: () => id && loadRequestDetails(id),
  };
}
