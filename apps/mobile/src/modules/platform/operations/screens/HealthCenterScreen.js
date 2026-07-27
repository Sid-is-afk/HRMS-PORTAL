import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { HealthStatusCard } from '../components/HealthStatusCard';
import { useOperations } from '../hooks/useOperations';

export default function HealthCenterScreen() {
  const { services, isLoading, error, fetchServices } = useOperations();

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Health Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <HealthStatusCard service={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
