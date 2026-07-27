import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { PlatformUserCard } from '../components/PlatformUserCard';
import { useIdentity } from '../hooks/useIdentity';

export default function PlatformUsersScreen() {
  const { platformUsers, isLoading, error, fetchUsers } = useIdentity();

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Platform Users" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={platformUsers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <PlatformUserCard user={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No platform users found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
