import React from 'react';
import { View, Text } from 'react-native';
import { useOfflineStore } from '@/shared/stores/offlineStore';

export function PendingChangesIndicator() {
  const pendingCount = useOfflineStore((state) => state.pendingActionsCount);

  if (pendingCount === 0) return null;

  return (
    <View className="flex-row items-center px-3 py-1 bg-orange-100 rounded-full">
      <View className="w-2 h-2 rounded-full bg-warning mr-2" />
      <Text className="text-warning text-xs font-medium">
        {pendingCount} pending change{pendingCount > 1 ? 's' : ''}
      </Text>
    </View>
  );
}
