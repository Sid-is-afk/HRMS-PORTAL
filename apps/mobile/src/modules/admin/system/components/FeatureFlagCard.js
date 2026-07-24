import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Flag } from 'lucide-react-native';

export const FeatureFlagCard = ({ featureFlag, onToggle }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center justify-between">
    <View className="flex-row items-center flex-1 pr-4">
      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
        <Flag size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold">{featureFlag.name}</Text>
        <Text className="text-textSecondary text-xs mt-1">{featureFlag.description}</Text>
      </View>
    </View>
    <Switch 
      value={featureFlag.is_enabled} 
      onValueChange={() => onToggle(featureFlag.id, featureFlag.is_enabled)}
      trackColor={{ false: '#CBD5E1', true: '#0EA5E9' }}
    />
  </View>
);
