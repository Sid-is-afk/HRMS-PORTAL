import React from 'react';
import { View, Text } from 'react-native';

export function InfoCard({ title, icon: Icon, children }) {
  return (
    <View className="bg-white rounded-3xl border border-border mb-4 overflow-hidden shadow-sm">
      <View className="bg-surface px-4 py-3 flex-row items-center border-b border-border">
        {Icon && <Icon size={18} color="#6B7280" className="mr-2" />}
        <Text className="text-textPrimary font-semibold font-inter">{title}</Text>
      </View>
      <View className="px-4 py-2">
        {children}
      </View>
    </View>
  );
}
