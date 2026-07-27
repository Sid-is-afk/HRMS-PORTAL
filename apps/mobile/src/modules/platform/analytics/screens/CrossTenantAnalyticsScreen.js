import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { TrendCard } from '../components/TrendCard';
import { useAnalytics } from '../hooks/useAnalytics';

export default function CrossTenantAnalyticsScreen() {
  const { trendMetrics, isLoading, error, fetchTrendMetrics } = useAnalytics();

  useEffect(() => {
    fetchTrendMetrics();
  }, [fetchTrendMetrics]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Growth & Analytics" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={trendMetrics}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TrendCard trend={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
