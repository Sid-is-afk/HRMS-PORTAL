import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { IncidentCard } from '../components/IncidentCard';
import { useOperations } from '../hooks/useOperations';

export default function IncidentCenterScreen() {
  const { incidents, isLoading, error, fetchIncidents } = useOperations();

  useEffect(() => {
    fetchIncidents();
  }, [fetchIncidents]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Incident Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={incidents}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <IncidentCard incident={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
