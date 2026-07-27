import React from 'react';
import { View, ScrollView } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';
import { usePeopleIntelligence } from '../hooks/usePeopleIntelligence';

export default function WorkforceAnalyticsScreen() {
  const { workforceMetrics, isLoading } = usePeopleIntelligence();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Workforce Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Headcount Distribution" data={workforceMetrics} />
        <TrendChartCard title="Tenure Distribution" data={[]} />
      </ScrollView>
    </View>
  );
}
