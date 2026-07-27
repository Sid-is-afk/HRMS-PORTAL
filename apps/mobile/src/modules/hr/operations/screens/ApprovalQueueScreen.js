import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ApprovalQueueCard } from '../components/ApprovalQueueCard';
import { useOperations } from '../hooks/useOperations';

export default function ApprovalQueueScreen() {
  const { approvals, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Approval Queue" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList\n        initialNumToRender={10}\n        maxToRenderPerBatch={10}\n        windowSize={5}
        data={approvals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ApprovalQueueCard approval={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No pending approvals.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
