import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ServiceRequestCard } from '../components/ServiceRequestCard';
import { useOperations } from '../hooks/useOperations';

export default function ServiceRequestCenterScreen() {
  const { serviceRequests, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Service Requests" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={serviceRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ServiceRequestCard request={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No open service requests.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
