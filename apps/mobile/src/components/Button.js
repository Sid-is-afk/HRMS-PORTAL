import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator } from 'react-native';

export function Button({ onPress, title, loading, disabled, styleClass = '' }) {
  const isDisabled = disabled || loading;
  return (
    <TouchableOpacity
      onPress={onPress}
      disabled={isDisabled}
      className={`h-12 bg-primary rounded-xl items-center justify-center flex-row ${isDisabled ? 'opacity-50' : ''} ${styleClass}`}
      activeOpacity={0.8}
    >
      {loading ? (
        <ActivityIndicator color="#FFFFFF" className="mr-2" />
      ) : null}
      <Text className="text-white font-inter font-semibold text-base">{title}</Text>
    </TouchableOpacity>
  );
}
