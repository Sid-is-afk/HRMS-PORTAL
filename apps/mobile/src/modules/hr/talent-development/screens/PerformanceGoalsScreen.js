import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { GoalCard } from '../components/GoalCard';
import { useTalentDevelopment } from '../hooks/useTalentDevelopment';

export default function PerformanceGoalsScreen() {
  const { goals, isLoading, error } = useTalentDevelopment();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Performance Goals" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <GoalCard goal={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No active goals found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
