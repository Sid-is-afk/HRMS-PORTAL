import React from 'react';
import { Text, View } from 'react-native';

export function SettingsSection({ title, children }) {
  return (
    <View className="mb-4">
      <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-slate-500">{title}</Text>
      {children}
    </View>
  );
}
