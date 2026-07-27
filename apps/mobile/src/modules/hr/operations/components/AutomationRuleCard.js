import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Zap, ArrowRight } from 'lucide-react-native';

export const AutomationRuleCard = ({ rule }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
      <Zap size={20} color="#0EA5E9" />
    </View>
    <View className="flex-1 pr-2">
      <Text className="text-textPrimary font-semibold text-base mb-1">{rule.name}</Text>
      <View className="flex-row items-center flex-wrap">
        <Text className="text-textSecondary text-xs">{rule.trigger}</Text>
        <ArrowRight size={12} color="#64748B" className="mx-1" />
        <Text className="text-primary text-xs font-medium">{rule.action}</Text>
      </View>
    </View>
    <Switch 
      value={rule.is_active} 
      onValueChange={() => {}}
      trackColor={{ false: '#CBD5E1', true: '#0EA5E9' }}
    />
  </View>
);
