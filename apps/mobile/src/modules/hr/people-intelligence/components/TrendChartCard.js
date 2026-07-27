import React from 'react';
import { View, Text } from 'react-native';
import { BarChart2 } from 'lucide-react-native';

export const TrendChartCard = ({ title, data }) => {
  // Mocking a chart view since we don't have charting libraries
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
      <Text className="text-textPrimary font-semibold mb-4">{title}</Text>
      <View className="h-40 bg-surface rounded items-center justify-center border border-border border-dashed">
        <BarChart2 size={32} color="#94A3B8" className="mb-2" />
        <Text className="text-textSecondary text-sm">[Chart Visualization Placeholder]</Text>
        <View className="flex-row flex-wrap justify-center mt-2 px-2">
          {data?.map((d, i) => (
            <Text key={i} className="text-xs text-textSecondary mr-2">{d.label}: {d.value}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};
