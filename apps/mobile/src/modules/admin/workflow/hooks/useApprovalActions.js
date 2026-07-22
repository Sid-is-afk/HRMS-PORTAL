import { useCallback } from 'react';
import { useWorkflowStore } from '../store/workflowStore';

export function useApprovalActions(id) {
  const { approve, reject, returnForChanges, addComment, isLoading } = useWorkflowStore((state) => ({
    approve: state.approve,
    reject: state.reject,
    returnForChanges: state.returnForChanges,
    addComment: state.addComment,
    isLoading: state.isLoading,
  }));

  const handleApprove = useCallback(async (comment) => {
    if (id) return await approve(id, comment);
  }, [id, approve]);

  const handleReject = useCallback(async (comment) => {
    if (id) return await reject(id, comment);
  }, [id, reject]);

  const handleReturn = useCallback(async (comment) => {
    if (id) return await returnForChanges(id, comment);
  }, [id, returnForChanges]);

  const handleAddComment = useCallback(async (text) => {
    if (id) return await addComment(id, text);
  }, [id, addComment]);

  return {
    approve: handleApprove,
    reject: handleReject,
    returnForChanges: handleReturn,
    addComment: handleAddComment,
    isLoading,
  };
}
