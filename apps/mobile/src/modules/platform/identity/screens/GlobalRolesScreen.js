import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { RoleCard } from '../components/RoleCard';
import { useIdentity } from '../hooks/useIdentity';

export default function GlobalRolesScreen() {
  const { globalRoles, isLoading, error, fetchRoles } = useIdentity();

  useEffect(() => {
    fetchRoles();
  }, [fetchRoles]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Global Roles" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={globalRoles}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <RoleCard role={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
