import { useEffect, useCallback } from 'react';
import { useCandidatePipelineStore } from '../store/candidatePipelineStore';
import { useShallow } from 'zustand/react/shallow';

export function useCandidate(candidateId) {
  const {
    selectedCandidate,
    isLoading,
    error,
    loadCandidate,
    addNote,
  } = useCandidatePipelineStore(useShallow((state) => ({
    selectedCandidate: state.selectedCandidate,
    isLoading: state.isLoading,
    error: state.error,
    loadCandidate: state.loadCandidate,
    addNote: state.addNote,
  })));

  useEffect(() => {
    if (candidateId) {
      loadCandidate(candidateId);
    }
  }, [candidateId, loadCandidate]);

  const handleAddNote = useCallback(async (text) => {
    if (candidateId && text) {
      return await addNote(candidateId, text);
    }
  }, [candidateId, addNote]);

  return {
    candidate: selectedCandidate,
    isLoading,
    error,
    refresh: () => candidateId && loadCandidate(candidateId),
    addNote: handleAddNote,
  };
}
