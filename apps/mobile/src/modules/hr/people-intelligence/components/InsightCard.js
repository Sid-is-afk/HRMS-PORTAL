import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react-native';

export const InsightCard = ({ insight }) => {
  let Icon = Info;
  let color = '#0EA5E9';
  let bgColor = 'bg-primary/10';

  if (insight.impact === 'High') {
    Icon = AlertTriangle;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (insight.impact === 'Medium') {
    Icon = Lightbulb;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row">
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bgColor}`}>
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textSecondary text-xs font-medium uppercase tracking-wider">{insight.category}</Text>
          <Text className="text-textSecondary text-xs">{new Date(insight.date).toLocaleDateString()}</Text>
        </View>
        <Text className="text-textPrimary text-sm leading-5">{insight.summary}</Text>
      </View>
    </View>
  );
};
