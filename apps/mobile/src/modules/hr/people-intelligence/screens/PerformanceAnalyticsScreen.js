import React from 'react';
import { View, ScrollView } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';

export default function PerformanceAnalyticsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Performance Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Goal Completion Rate" data={[]} />
        <TrendChartCard title="Performance Distribution" data={[]} />
      </ScrollView>
    </View>
  );
}
