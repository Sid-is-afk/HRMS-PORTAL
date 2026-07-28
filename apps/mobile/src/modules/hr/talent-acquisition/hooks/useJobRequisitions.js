import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useJobRequisitions() {
  const jobRequisitions = useTalentAcquisitionStore((state) => state.jobRequisitions);
  const selectedRequisitionId = useTalentAcquisitionStore((state) => state.selectedRequisitionId);
  const setSelectedRequisitionId = useTalentAcquisitionStore((state) => state.setSelectedRequisitionId);
  const createRequisition = useTalentAcquisitionStore((state) => state.createRequisition);
  const updateRequisition = useTalentAcquisitionStore((state) => state.updateRequisition);
  const isLoading = useTalentAcquisitionStore((state) => state.isLoading);
  const error = useTalentAcquisitionStore((state) => state.error);

  const selectedRequisition = jobRequisitions.find(r => r.id === selectedRequisitionId) || null;

  return {
    jobRequisitions,
    selectedRequisition,
    selectedRequisitionId,
    setSelectedRequisitionId,
    createRequisition,
    updateRequisition,
    isLoading,
    error,
  };
}
