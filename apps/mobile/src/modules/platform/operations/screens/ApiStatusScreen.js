import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function ApiStatusScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Status Workspace" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4 mt-20">Monitoring Placeholder</Text>
        <Text className="text-textSecondary text-center">
          API Availability, Queue Status, Background Jobs, and Audit Events will be orchestrated from this central routing hub.
        </Text>
      </ScrollView>
    </View>
  );
}
