import React from 'react';
import { View, Text } from 'react-native';

export function DetailRow({ label, value, isLast = false }) {
  return (
    <View className={`flex-row justify-between py-3 ${isLast ? '' : 'border-b border-border'}`}>
      <Text className="text-textSecondary text-sm font-inter flex-1">{label}</Text>
      <Text className="text-textPrimary text-sm font-inter font-medium flex-1 text-right">{value || '—'}</Text>
    </View>
  );
}
