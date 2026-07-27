import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ProbationCard } from '../components/ProbationCard';
import { useEmployeeLifecycle } from '../hooks/useEmployeeLifecycle';

export default function ProbationTrackerScreen() {
  const { probations } = useEmployeeLifecycle();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Probation Tracking" showBack={true} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Monitor employees currently on probation and prepare for confirmation reviews.
        </Text>
        
        {probations.map(probation => (
          <ProbationCard key={probation.id} probation={probation} />
        ))}
      </ScrollView>
    </View>
  );
}
