import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { useOfflineStore } from '../store/offlineStore';

export function SyncIndicator() {
  const isSyncing = useOfflineStore((state) => state.isSyncing);

  if (!isSyncing) return null;

  return (
    <View className="flex-row items-center space-x-2 px-3 py-1 bg-surface rounded-full">
      <ActivityIndicator size="small" color="#4F46E5" />
      <Text className="text-textSecondary text-xs">Syncing...</Text>
    </View>
  );
}
