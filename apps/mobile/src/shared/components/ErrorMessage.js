import React from 'react';
import { View, Text } from 'react-native';

export function ErrorMessage({ message, styleClass = '' }) {
  if (!message) return null;
  return (
    <View className={`bg-red-50 px-4 py-3 rounded-lg mb-5 border-l-4 border-error flex-row items-center shadow-sm ${styleClass}`}>
      <View className="w-5 h-5 rounded-full bg-error items-center justify-center mr-3">
        <Text className="text-white font-bold text-xs">!</Text>
      </View>
      <Text className="text-error font-inter font-medium text-sm flex-1">{message}</Text>
    </View>
  );
}
