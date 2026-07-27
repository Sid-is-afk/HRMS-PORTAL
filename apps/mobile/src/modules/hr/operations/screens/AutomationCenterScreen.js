import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { AutomationRuleCard } from '../components/AutomationRuleCard';
import { useOperations } from '../hooks/useOperations';

export default function AutomationCenterScreen() {
  const { automationRules, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Automation Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={automationRules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <AutomationRuleCard rule={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No automation rules configured.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
