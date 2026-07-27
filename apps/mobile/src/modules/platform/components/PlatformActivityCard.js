import React from 'react';
import { View, Text } from 'react-native';
import { Activity } from 'lucide-react-native';

export const PlatformActivityCard = ({ activity }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-start">
      <View className="mt-1 mr-3">
        <Activity size={16} color={activity.severity === 'Warning' ? '#F59E0B' : '#0EA5E9'} />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary text-sm font-medium mb-1">{activity.description}</Text>
        <Text className="text-textSecondary text-xs">{new Date(activity.timestamp).toLocaleString()}</Text>
      </View>
    </View>
  );
};
