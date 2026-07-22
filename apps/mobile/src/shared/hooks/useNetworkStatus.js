import { useOfflineStore } from '@/shared/stores/offlineStore';

/**
 * Hook to consume current network status.
 * Returns { isOnline: boolean }
 */
export function useNetworkStatus() {
  const isOnline = useOfflineStore((state) => state.isOnline);
  
  return {
    isOnline,
    isOffline: !isOnline
  };
}
