import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { InsightCard } from '../components/InsightCard';
import { usePeopleIntelligence } from '../hooks/usePeopleIntelligence';

export default function InsightsHubScreen() {
  const { insights, isLoading, error } = usePeopleIntelligence();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Insights Hub" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList\n        initialNumToRender={10}\n        maxToRenderPerBatch={10}\n        windowSize={5}
        data={insights}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <InsightCard insight={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No new insights generated.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
