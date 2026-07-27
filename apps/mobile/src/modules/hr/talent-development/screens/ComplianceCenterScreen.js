import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ComplianceBadge } from '../components/ComplianceBadge';
import { useTalentDevelopment } from '../hooks/useTalentDevelopment';

export default function ComplianceCenterScreen() {
  const { complianceRecords, isLoading, error } = useTalentDevelopment();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Compliance Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={complianceRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ComplianceBadge record={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No compliance records found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
