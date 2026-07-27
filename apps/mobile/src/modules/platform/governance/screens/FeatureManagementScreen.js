import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { FeatureCard } from '../components/FeatureCard';
import { useGovernance } from '../hooks/useGovernance';
import { useGovernanceStore } from '../store/governanceStore';

export default function FeatureManagementScreen() {
  const { features, isLoading, error, fetchFeatures } = useGovernance();
  const setFeatures = useGovernanceStore(state => state.setFeatures);

  useEffect(() => {
    fetchFeatures();
  }, [fetchFeatures]);

  const handleToggle = (id, val) => {
    const updated = features.map(f => f.id === id ? { ...f, enabled: val } : f);
    setFeatures(updated);
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Feature Management" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={features}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <FeatureCard feature={item} onToggle={handleToggle} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
