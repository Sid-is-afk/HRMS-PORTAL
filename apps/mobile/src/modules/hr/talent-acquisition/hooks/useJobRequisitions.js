import { useTalentAcquisitionStore } from '../store/talentAcquisitionStore';

export function useJobRequisitions() {
  const {
    jobRequisitions,
    selectedRequisitionId,
    setSelectedRequisitionId,
    createRequisition,
    updateRequisition,
    isLoading,
    error,
  } = useTalentAcquisitionStore((state) => ({
    jobRequisitions: state.jobRequisitions,
    selectedRequisitionId: state.selectedRequisitionId,
    setSelectedRequisitionId: state.setSelectedRequisitionId,
    createRequisition: state.createRequisition,
    updateRequisition: state.updateRequisition,
    isLoading: state.isLoading,
    error: state.error,
  }));

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
