import React from 'react';
import { View, Text } from 'react-native';

export const ExecutiveMetricCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 w-[48%]">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full bg-surface items-center justify-center mr-2">
          {Icon && <Icon size={16} color="#6366F1" />}
        </View>
        <Text className="text-textSecondary text-[10px] uppercase font-bold flex-1" numberOfLines={1}>{title}</Text>
      </View>
      <Text className="text-textPrimary text-xl font-bold">{value}</Text>
      {trend && (
        <Text className={`text-xs mt-1 font-bold ${trend === 'Up' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>
          {trend === 'Up' ? '↑' : '↓'} Trending
        </Text>
      )}
    </View>
  );
};
