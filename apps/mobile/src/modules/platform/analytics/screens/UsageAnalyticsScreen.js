import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { UsageHeatmap } from '../components/UsageHeatmap';
import { useAnalytics } from '../hooks/useAnalytics';

export default function UsageAnalyticsScreen() {
  const { usageMetrics, isLoading, error, fetchUsageMetrics } = useAnalytics();

  useEffect(() => {
    fetchUsageMetrics();
  }, [fetchUsageMetrics]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Usage Analytics" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={usageMetrics}
        keyExtractor={(item) => item.feature}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <UsageHeatmap metric={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
