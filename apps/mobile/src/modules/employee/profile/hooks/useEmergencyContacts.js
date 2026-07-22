import { useEffect } from 'react';
import { useProfileStore } from '@/modules/employee/profile/store/profileStore';

export function useEmergencyContacts() {
  const { emergencyContacts, isLoading, error, fetchEmergencyContacts } = useProfileStore();

  useEffect(() => {
    fetchEmergencyContacts();
  }, [fetchEmergencyContacts]);

  return {
    emergencyContacts,
    isLoading,
    error,
    refreshContacts: fetchEmergencyContacts,
  };
}
