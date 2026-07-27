import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { SubscriptionCard } from '../components/SubscriptionCard';
import { useGovernance } from '../hooks/useGovernance';

export default function SubscriptionCenterScreen() {
  const { subscriptions, isLoading, error, fetchSubscriptions } = useGovernance();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Subscription Plans" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {subscriptions.map(sub => (
          <SubscriptionCard key={sub.id} plan={sub} />
        ))}
      </ScrollView>
    </View>
  );
}
