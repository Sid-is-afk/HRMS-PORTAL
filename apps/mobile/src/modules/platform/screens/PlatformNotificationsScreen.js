import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformNotificationCard } from '../components/PlatformNotificationCard';
import { usePlatformDashboard } from '../hooks/usePlatformDashboard';

export default function PlatformNotificationsScreen() {
  const { notifications, isLoading, error } = usePlatformDashboard();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Global Notifications" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <PlatformNotificationCard notification={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No notifications.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
