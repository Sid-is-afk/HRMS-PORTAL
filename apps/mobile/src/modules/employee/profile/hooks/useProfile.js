import { useEffect, useCallback } from 'react';
import { useProfileStore } from '@/modules/employee/profile/store/profileStore';

export function useProfile() {
  const { profile, isLoading, isRefreshing, error, fetchProfile, refreshProfileData } = useProfileStore();

  useEffect(() => {
    fetchProfile(false);
  }, [fetchProfile]);

  const refreshProfile = useCallback(() => {
    return fetchProfile(true);
  }, [fetchProfile]);

  return {
    profile,
    isLoading,
    isRefreshing,
    error,
    refreshProfile,
    refreshProfileData,
  };
}
