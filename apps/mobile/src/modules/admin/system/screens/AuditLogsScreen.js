import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function AuditLogsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Audit Logs" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Audit log viewer placeholder. Will contain searchable data table for system events.
        </Text>
      </View>
    </View>
  );
}
