import { useEffect } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export function useApprovalQueue() {
  const { queue, isLoading, error, filters, setFilters, loadApprovalQueue } = useWorkflowStore(
    (state) => ({
      queue: state.queue,
      isLoading: state.isLoading,
      error: state.error,
      filters: state.filters,
      setFilters: state.setFilters,
      loadApprovalQueue: state.loadApprovalQueue,
    })
  );

  useEffect(() => {
    loadApprovalQueue();
  }, [loadApprovalQueue]);

  return {
    queue,
    isLoading,
    error,
    filters,
    setFilters,
    refresh: loadApprovalQueue,
  };
}
