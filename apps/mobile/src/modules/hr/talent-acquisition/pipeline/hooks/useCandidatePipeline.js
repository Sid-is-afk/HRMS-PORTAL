import { useEffect } from 'react';
import { useCandidatePipelineStore } from '../store/candidatePipelineStore';

export function useCandidatePipeline() {
  const {
    pipeline,
    isLoading,
    error,
    loadPipeline,
    updateCandidateStage,
  } = useCandidatePipelineStore((state) => ({
    pipeline: state.pipeline,
    isLoading: state.isLoading,
    error: state.error,
    loadPipeline: state.loadPipeline,
    updateCandidateStage: state.updateCandidateStage,
  }));

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
