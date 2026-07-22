import React from 'react';
import { Switch, Text, View } from 'react-native';

export function SettingsToggle({ label, description, value, onValueChange }) {
  return (
    <View className="mb-2 rounded-xl border border-slate-200 bg-white p-3">
      <View className="flex-row items-center justify-between">
        <View className="flex-1 pr-3">
          <Text className="text-sm font-semibold text-slate-900">{label}</Text>
          {description ? <Text className="mt-1 text-sm text-slate-500">{description}</Text> : null}
        </View>
        <Switch value={value} onValueChange={onValueChange} />
      </View>
    </View>
  );
}
