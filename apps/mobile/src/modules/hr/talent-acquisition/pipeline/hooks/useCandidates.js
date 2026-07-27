import { useEffect } from 'react';
import { useCandidatePipelineStore } from '../store/candidatePipelineStore';

export function useCandidates() {
  const {
    candidates,
    filters,
    isLoading,
    error,
    loadCandidates,
    setFilters,
    resetFilters,
    createCandidate,
  } = useCandidatePipelineStore((state) => ({
    candidates: state.candidates,
    filters: state.filters,
    isLoading: state.isLoading,
    error: state.error,
    loadCandidates: state.loadCandidates,
    setFilters: state.setFilters,
    resetFilters: state.resetFilters,
    createCandidate: state.createCandidate,
  }));

  useEffect(() => {
    loadCandidates();
  }, [loadCandidates]);

  return {
    candidates,
    filters,
    isLoading,
    error,
    setFilters,
    resetFilters,
    refresh: loadCandidates,
    createCandidate,
  };
}
