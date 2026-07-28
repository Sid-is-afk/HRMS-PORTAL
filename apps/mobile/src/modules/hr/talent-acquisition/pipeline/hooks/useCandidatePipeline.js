import { useEffect } from 'react';
import { useCandidatePipelineStore } from '../store/candidatePipelineStore';
import { useShallow } from 'zustand/react/shallow';

export function useCandidatePipeline() {
  const {
    pipeline,
    isLoading,
    error,
    loadPipeline,
    updateCandidateStage,
  } = useCandidatePipelineStore(useShallow((state) => ({
    pipeline: state.pipeline,
    isLoading: state.isLoading,
    error: state.error,
    loadPipeline: state.loadPipeline,
    updateCandidateStage: state.updateCandidateStage,
  })));

  useEffect(() => {
    loadPipeline();
  }, [loadPipeline]);

  return {
    pipeline,
    isLoading,
    error,
    refresh: loadPipeline,
    updateCandidateStage,
  };
}
