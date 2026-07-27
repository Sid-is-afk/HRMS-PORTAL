import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function CapacityDashboardScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Capacity & Forecasts" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4 mt-20">Analytics Placeholder</Text>
        <Text className="text-textSecondary text-center">
          Detailed metrics for Storage Utilization, API Quotas, and AI Recommendations will be rendered here.
        </Text>
      </ScrollView>
    </View>
  );
}
