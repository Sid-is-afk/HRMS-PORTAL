import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { HealthStatusCard } from '../components/HealthStatusCard';
import { useSystemHealth } from '../hooks/useSystemHealth';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function SystemHealthScreen() {
  const { healthMetrics, isLoading, error } = useSystemHealth();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="System Health" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {healthMetrics.map((metric, index) => (
          <HealthStatusCard key={index} metric={metric} />
        ))}
      </ScrollView>
    </View>
  );
}
