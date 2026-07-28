import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useJobPostings() {
  const jobPostings = useTalentAcquisitionStore((state) => state.jobPostings);
  const selectedPostingId = useTalentAcquisitionStore((state) => state.selectedPostingId);
  const setSelectedPostingId = useTalentAcquisitionStore((state) => state.setSelectedPostingId);
  const publishPosting = useTalentAcquisitionStore((state) => state.publishPosting);
  const archivePosting = useTalentAcquisitionStore((state) => state.archivePosting);
  const isLoading = useTalentAcquisitionStore((state) => state.isLoading);
  const error = useTalentAcquisitionStore((state) => state.error);

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
