import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { TenantCard } from '../components/TenantCard';
import { useTenants } from '../hooks/useTenants';

export default function TenantDirectoryScreen() {
  const navigation = useNavigation();
  const { tenants, isLoading, error, fetchTenants } = useTenants();

  useEffect(() => {
    fetchTenants();
  }, [fetchTenants]);

  const handlePress = (tenant) => {
    navigation.navigate('TenantDetails', { tenantId: tenant.id });
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Tenant Directory" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={tenants}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <TenantCard tenant={item} onPress={handlePress} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No tenants found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
