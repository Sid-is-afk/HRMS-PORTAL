import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { TenantTimeline } from '../components/TenantTimeline';
import { useTenants } from '../hooks/useTenants';
import { useRoute } from '@react-navigation/native';
import { TenantStatusBadge } from '../components/TenantStatusBadge';

export default function TenantDetailsScreen() {
  const route = useRoute();
  const { tenantId } = route.params || {};
  const { selectedTenant, lifecycleEvents, isLoading, error, getTenantDetails } = useTenants();

  useEffect(() => {
    if (tenantId) getTenantDetails(tenantId);
  }, [tenantId]);

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Tenant Profile" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {selectedTenant && (
          <>
            <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
              <View className="flex-row justify-between items-center mb-4">
                <Text className="text-xl font-bold text-textPrimary">{selectedTenant.name}</Text>
                <TenantStatusBadge status={selectedTenant.status} />
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary text-sm">Org Code:</Text>
                <Text className="text-textPrimary text-sm font-medium">{selectedTenant.orgCode}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary text-sm">Industry:</Text>
                <Text className="text-textPrimary text-sm font-medium">{selectedTenant.industry}</Text>
              </View>
              <View className="flex-row justify-between mb-2">
                <Text className="text-textSecondary text-sm">Contact:</Text>
                <Text className="text-textPrimary text-sm font-medium">{selectedTenant.primaryContact}</Text>
              </View>
            </View>

            <TenantTimeline events={lifecycleEvents} />
          </>
        )}
      </ScrollView>
    </View>
  );
}
