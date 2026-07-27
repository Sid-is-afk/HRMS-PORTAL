import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useJobPostings() {
  const {
    jobPostings,
    selectedPostingId,
    setSelectedPostingId,
    publishPosting,
    archivePosting,
    isLoading,
    error,
  } = useTalentAcquisitionStore((state) => ({
    jobPostings: state.jobPostings,
    selectedPostingId: state.selectedPostingId,
    setSelectedPostingId: state.setSelectedPostingId,
    publishPosting: state.publishPosting,
    archivePosting: state.archivePosting,
    isLoading: state.isLoading,
    error: state.error,
  }));

  const selectedPosting = jobPostings.find(p => p.id === selectedPostingId) || null;

  return {
    jobPostings,
    selectedPosting,
    selectedPostingId,
    setSelectedPostingId,
    publishPosting,
    archivePosting,
    isLoading,
    error,
  };
}
