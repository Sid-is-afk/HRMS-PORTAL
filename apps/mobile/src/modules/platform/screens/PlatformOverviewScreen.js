import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformSummaryCard } from '../components/PlatformSummaryCard';
import { usePlatformDashboard } from '../hooks/usePlatformDashboard';

export default function PlatformOverviewScreen() {
  const { dashboardSummary, isLoading } = usePlatformDashboard();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Platform Overview" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {dashboardSummary && (
          <>
            <PlatformSummaryCard title="Version" value={dashboardSummary.platformVersion} />
            <Text className="text-textSecondary mt-4">More overview analytics will be placed here.</Text>
          </>
        )}
      </ScrollView>
    </View>
  );
}
