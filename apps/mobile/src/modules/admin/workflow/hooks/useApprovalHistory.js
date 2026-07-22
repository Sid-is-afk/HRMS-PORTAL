import { useWorkflowStore } from '../store/workflowStore';

export function useApprovalHistory() {
  const history = useWorkflowStore((state) => state.selectedRequest?.history || []);

  return {
    history,
  };
}
