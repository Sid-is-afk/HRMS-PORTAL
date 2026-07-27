import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { CaseCard } from '../components/CaseCard';
import { useOperations } from '../hooks/useOperations';

export default function CaseManagementScreen() {
  const { cases, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Case Management" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        data={cases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <CaseCard hrCase={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No active cases.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
