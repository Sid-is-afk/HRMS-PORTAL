import { useCallback } from 'react';
import { useCandidatePipelineStore } from '../store/candidatePipelineStore';
import { useShallow } from 'zustand/react/shallow';

export function useInterviewFeedback() {
  const {
    isLoading,
    error,
    submitFeedback,
  } = useCandidatePipelineStore(useShallow((state) => ({
    isLoading: state.isLoading,
    error: state.error,
    submitFeedback: state.submitFeedback,
  })));

  const handleSubmit = useCallback(async (interviewId, feedbackData, candidateId) => {
    return await submitFeedback(interviewId, feedbackData, candidateId);
  }, [submitFeedback]);

  return {
    isLoading,
    error,
    submitFeedback: handleSubmit,
  };
}
