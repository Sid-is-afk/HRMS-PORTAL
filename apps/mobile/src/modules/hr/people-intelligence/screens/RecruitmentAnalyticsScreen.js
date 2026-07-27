import React from 'react';
import { View, ScrollView } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';

export default function RecruitmentAnalyticsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Recruitment Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Hiring Funnel" data={[]} />
        <TrendChartCard title="Time to Fill Trends" data={[]} />
      </ScrollView>
    </View>
  );
}
