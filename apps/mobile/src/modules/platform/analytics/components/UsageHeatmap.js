import React from 'react';
import { View, Text } from 'react-native';

export const UsageHeatmap = ({ metric }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-textPrimary text-sm font-bold">{metric.feature}</Text>
        <Text className="text-textSecondary text-xs">{metric.usageCount.toLocaleString()} hits</Text>
      </View>
      <View className="w-full bg-surface h-2 rounded-full overflow-hidden">
        <View className="bg-[#6366F1] h-full" style={{ width: `${Math.min((metric.usageCount / 2000000) * 100, 100)}%` }} />
      </View>
      <Text className="text-textSecondary text-[10px] mt-2 text-right">{metric.uniqueUsers.toLocaleString()} Unique Users</Text>
    </View>
  );
};
