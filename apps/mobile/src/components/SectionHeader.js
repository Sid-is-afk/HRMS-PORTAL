import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export function SectionHeader({ title, onAction, actionTitle }) {
  return (
    <View className="flex-row justify-between items-end px-4 mt-8 mb-4">
      <Text className="text-textPrimary text-xl font-bold font-inter tracking-tight">{title}</Text>
      {onAction && actionTitle && (
        <TouchableOpacity onPress={onAction} activeOpacity={0.6} className="pb-1">
          <Text className="text-primary text-sm font-semibold font-inter">{actionTitle}</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}
