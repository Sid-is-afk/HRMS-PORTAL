import * as Network from 'expo-network';
import { useOfflineStore } from '../store/offlineStore';

let isMonitoring = false;

export const networkMonitor = {
  /**
   * Initializes network monitoring if not already started.
   * On native, this might require a background timer or hooking into AppState.
   * Expo Network doesn't provide an event listener out of the box in the same way 
   * @react-native-community/netinfo does, so we implement a polling strategy or rely on AppState.
   */
  startMonitoring: (intervalMs = 5000) => {
    if (isMonitoring) return;
    isMonitoring = true;

    // Initial check
    networkMonitor.checkNetworkStatus();

    // Poll periodically
    setInterval(() => {
      if (isMonitoring) {
        networkMonitor.checkNetworkStatus();
      }
    }, intervalMs);
  },

  stopMonitoring: () => {
    isMonitoring = false;
  },

  checkNetworkStatus: async () => {
    try {
      const state = await Network.getNetworkStateAsync();
      const isOnline = state.isConnected && state.isInternetReachable;
      
      const { isOnline: currentStatus, setOnlineStatus } = useOfflineStore.getState();
      
      // Only update if it actually changed to prevent unnecessary re-renders
      if (isOnline !== currentStatus) {
        setOnlineStatus(isOnline);
      }
      
      return isOnline;
    } catch (error) {
      console.warn('Failed to check network status:', error);
      return false;
    }
  }
};
