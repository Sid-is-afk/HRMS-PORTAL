import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ModuleCard } from '../components/ModuleCard';
import { useGovernance } from '../hooks/useGovernance';

export default function ModuleCatalogScreen() {
  const { modules, isLoading, error, fetchModules } = useGovernance();

  useEffect(() => {
    fetchModules();
  }, [fetchModules]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Module Catalog" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={modules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ModuleCard module={item} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
