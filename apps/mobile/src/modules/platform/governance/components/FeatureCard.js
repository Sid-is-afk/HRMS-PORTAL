import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Settings2 } from 'lucide-react-native';

export const FeatureCard = ({ feature, onToggle }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Settings2 size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold mr-2">{feature.name}</Text>
          <View className="px-2 py-0.5 rounded-full bg-surface">
            <Text className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">{feature.rolloutStage}</Text>
          </View>
        </View>
        <Text className="text-textSecondary text-xs">{feature.description}</Text>
        <Text className="text-textSecondary text-[10px] mt-1">Category: {feature.category}</Text>
      </View>
      <Switch 
        value={feature.enabled} 
        onValueChange={(val) => onToggle && onToggle(feature.id, val)}
        trackColor={{ false: '#E2E8F0', true: '#10B981' }}
      />
    </View>
  );
};
