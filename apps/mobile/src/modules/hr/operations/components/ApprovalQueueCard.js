import React from 'react';
import { View, Text } from 'react-native';
import { CheckSquare, User } from 'lucide-react-native';

export const ApprovalQueueCard = ({ approval }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <View className="flex-row items-center mb-2">
      <CheckSquare size={16} color="#10B981" className="mr-2" />
      <Text className="text-textPrimary font-semibold text-base">{approval.summary}</Text>
    </View>
    <View className="flex-row items-center justify-between mt-1">
      <View className="flex-row items-center">
        <User size={12} color="#94A3B8" className="mr-1" />
        <Text className="text-textSecondary text-xs">Req by: {approval.requested_by}</Text>
      </View>
      <Text className="text-textSecondary text-xs bg-surface px-2 py-1 rounded">
        {approval.source_module}
      </Text>
    </View>
  </View>
);
