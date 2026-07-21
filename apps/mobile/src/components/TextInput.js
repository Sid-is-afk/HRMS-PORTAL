import React from 'react';
import { View, TextInput as RNTextInput, Text } from 'react-native';

export function TextInput({ label, error, styleClass = '', ...props }) {
  return (
    <View className={`mb-4 ${styleClass}`}>
      {label ? <Text className="text-textSecondary text-sm mb-1.5 font-inter">{label}</Text> : null}
      <View className={`h-12 border rounded-xl px-4 justify-center bg-surface ${error ? 'border-error' : 'border-border'}`}>
        <RNTextInput
          className="flex-1 text-textPrimary text-base font-inter"
          placeholderTextColor="#9CA3AF"
          {...props}
        />
      </View>
      {error ? <Text className="text-error text-xs mt-1.5 font-inter">{error}</Text> : null}
    </View>
  );
}
