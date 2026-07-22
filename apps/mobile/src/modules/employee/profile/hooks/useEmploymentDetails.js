import { useEffect } from 'react';
import { useProfileStore } from '@/modules/employee/profile/store/profileStore';

export function useEmploymentDetails() {
  const { employmentDetails, isLoading, error, fetchEmploymentDetails } = useProfileStore();

  useEffect(() => {
    fetchEmploymentDetails();
  }, [fetchEmploymentDetails]);

  return {
    employmentDetails,
    isLoading,
    error,
    refreshEmployment: fetchEmploymentDetails,
  };
}
