import { useCallback } from 'react';
import { useCandidatePipelineStore } from '../store/candidatePipelineStore';

export function useInterviewSchedule() {
  const {
    isLoading,
    error,
    scheduleInterview,
    rescheduleInterview,
    cancelInterview,
  } = useCandidatePipelineStore((state) => ({
    isLoading: state.isLoading,
    error: state.error,
    scheduleInterview: state.scheduleInterview,
    rescheduleInterview: state.rescheduleInterview,
    cancelInterview: state.cancelInterview,
  }));

  const handleSchedule = useCallback(async (candidateId, interviewData) => {
    return await scheduleInterview(candidateId, interviewData);
  }, [scheduleInterview]);

  const handleReschedule = useCallback(async (interviewId, newTimeData, candidateId) => {
    return await rescheduleInterview(interviewId, newTimeData, candidateId);
  }, [rescheduleInterview]);

  const handleCancel = useCallback(async (interviewId, candidateId) => {
    return await cancelInterview(interviewId, candidateId);
  }, [cancelInterview]);

  return {
    isLoading,
    error,
    scheduleInterview: handleSchedule,
    rescheduleInterview: handleReschedule,
    cancelInterview: handleCancel,
  };
}
