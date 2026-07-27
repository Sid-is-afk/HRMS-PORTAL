import React from 'react';
import { View, Text } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Button } from '@/shared/components/Button';

export const SubscriptionCard = ({ plan }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
          <CreditCard size={20} color="#F59E0B" />
        </View>
        <Text className="text-textPrimary text-lg font-bold">{plan.name}</Text>
      </View>
      
      <View className="border-t border-border pt-3 mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-textSecondary text-xs">User Limit</Text>
          <Text className="text-textPrimary text-xs font-bold">{plan.userLimit.toLocaleString()}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-textSecondary text-xs">Storage Limit</Text>
          <Text className="text-textPrimary text-xs font-bold">{plan.storageLimitGb} GB</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-textSecondary text-xs">Included Modules</Text>
          <Text className="text-textPrimary text-xs font-bold">{plan.includedModules.length}</Text>
        </View>
      </View>

      <Button title="Edit Plan" onPress={() => {}} styleClass="bg-surface border border-border h-8" textClass="text-textPrimary text-xs" />
    </View>
  );
};
