import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

export const TrendCard = ({ trend }) => {
  const isUp = trend.trend === 'Up';
  const isFlat = trend.trend === 'Flat';
  const color = isUp ? '#10B981' : isFlat ? '#94A3B8' : '#EF4444';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center justify-between">
      <View>
        <Text className="text-textPrimary text-sm font-bold mb-1">{trend.label}</Text>
        <Text className="text-textSecondary text-xs">{trend.value.toLocaleString()}</Text>
      </View>
      <View className="items-end flex-row">
        {isUp ? <TrendingUp size={16} color={color} className="mr-1" /> : 
         isFlat ? <Minus size={16} color={color} className="mr-1" /> : 
         <TrendingDown size={16} color={color} className="mr-1" />}
        <Text className="text-xs font-bold" style={{ color }}>{trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%</Text>
      </View>
    </View>
  );
};
