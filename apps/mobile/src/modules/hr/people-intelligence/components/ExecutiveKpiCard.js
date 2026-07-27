import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

export const ExecutiveKpiCard = ({ kpi }) => {
  let Icon = Minus;
  let color = '#64748B';

  if (kpi.trend === 'up') {
    Icon = TrendingUp;
    color = '#10B981';
  } else if (kpi.trend === 'down') {
    Icon = TrendingDown;
    color = '#EF4444';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border w-[48%] mb-4">
      <Text className="text-textSecondary text-xs mb-2">{kpi.title}</Text>
      <Text className="text-textPrimary text-2xl font-bold mb-2">{kpi.value}</Text>
      <View className="flex-row items-center">
        <Icon size={14} color={color} className="mr-1" />
        <Text style={{ color }} className="text-xs font-medium">{kpi.percentage} vs last month</Text>
      </View>
    </View>
  );
};
