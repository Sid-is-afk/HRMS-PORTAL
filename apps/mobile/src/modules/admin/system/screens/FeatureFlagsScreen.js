import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { FeatureFlagCard } from '../components/FeatureFlagCard';
import { useFeatureFlags } from '../hooks/useFeatureFlags';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function FeatureFlagsScreen() {
  const { featureFlags, isLoading, error, toggleFeatureFlag } = useFeatureFlags();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Feature Flags" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <Text className="text-textSecondary text-sm mb-4">
          Toggle experimental features across the application.
        </Text>
        
        {featureFlags.map((flag) => (
          <FeatureFlagCard 
            key={flag.id} 
            featureFlag={flag} 
            onToggle={toggleFeatureFlag} 
          />
        ))}
      </ScrollView>
    </View>
  );
}
