import React from 'react';
import { View, ScrollView } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';

export default function LearningAnalyticsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Learning Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Course Completion" data={[]} />
        <TrendChartCard title="Compliance Score" data={[]} />
      </ScrollView>
    </View>
  );
}
