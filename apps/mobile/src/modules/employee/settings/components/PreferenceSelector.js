import React from 'react';
import { Pressable, Text, View } from 'react-native';

export function PreferenceSelector({ label, options, value, onSelect }) {
  return (
    <View className="mb-3">
      <Text className="mb-2 text-sm font-semibold text-slate-700">{label}</Text>
      <View className="flex-row flex-wrap gap-2">
        {options.map((option) => {
          const isActive = value === option.value;
          return (
            <Pressable
              key={option.value}
              onPress={() => onSelect(option.value)}
              className={`rounded-full border px-3 py-2 ${isActive ? 'border-blue-600 bg-blue-600' : 'border-slate-200 bg-white'}`}
            >
              <Text className={`text-sm ${isActive ? 'text-white' : 'text-slate-700'}`}>{option.label}</Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
