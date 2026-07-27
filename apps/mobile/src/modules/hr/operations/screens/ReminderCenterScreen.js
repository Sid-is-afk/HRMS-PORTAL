import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ReminderCard } from '../components/ReminderCard';
import { useOperations } from '../hooks/useOperations';

export default function ReminderCenterScreen() {
  const { reminders, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Reminder Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList\n        initialNumToRender={10}\n        maxToRenderPerBatch={10}\n        windowSize={5}
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ReminderCard reminder={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No reminders scheduled.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
