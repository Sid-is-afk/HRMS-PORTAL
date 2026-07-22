import React from 'react';
import { View } from 'react-native';

export function Divider({ className = '' }) {
  return <View className={`h-[1px] bg-border w-full my-4 ${className}`} />;
}
