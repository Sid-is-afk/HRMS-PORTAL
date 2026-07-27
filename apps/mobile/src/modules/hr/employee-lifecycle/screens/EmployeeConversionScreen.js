import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { EmployeeConversionCard } from '../components/EmployeeConversionCard';
import { useEmployeeLifecycle } from '../hooks/useEmployeeLifecycle';

export default function EmployeeConversionScreen() {
  const { conversions, isLoading, error } = useEmployeeLifecycle();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Candidate Conversion" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={conversions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <EmployeeConversionCard 
            conversion={item} 
            onPress={() => console.log('View conversion details')}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No pending conversions.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
