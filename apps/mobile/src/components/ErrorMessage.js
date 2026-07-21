import React from 'react';
import { View, Text } from 'react-native';

export function ErrorMessage({ message, styleClass = '' }) {
  if (!message) return null;
  return (
    <View className={`bg-red-50 p-3 rounded-xl mb-4 border border-red-100 ${styleClass}`}>
      <Text className="text-error font-inter text-sm">{message}</Text>
    </View>
  );
}
