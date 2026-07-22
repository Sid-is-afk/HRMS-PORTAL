import { create } from 'zustand';

export const useOfflineStore = create((set) => ({
  isOnline: true,
  isSyncing: false,
  pendingActionsCount: 0,
  lastSyncTimestamp: null,

  setOnlineStatus: (status) => set({ isOnline: status }),
  setSyncing: (status) => set({ isSyncing: status }),
  setPendingActionsCount: (count) => set({ pendingActionsCount: count }),
  setLastSyncTimestamp: (timestamp) => set({ lastSyncTimestamp: timestamp }),
}));
