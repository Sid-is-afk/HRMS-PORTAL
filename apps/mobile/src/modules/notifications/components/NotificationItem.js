import React from 'react';
import { Pressable, Text, View } from 'react-native';

export default function NotificationItem({ item, onPress }) {
  return (
    <Pressable
      onPress={() => onPress(item)}
      className={`rounded-2xl border px-4 py-3 ${item.read ? 'border-slate-200 bg-white' : 'border-blue-200 bg-blue-50'}`}
    >
      <View className="flex-row items-start justify-between gap-2">
        <View className="flex-1">
          <Text className="text-base font-semibold text-slate-900">{item.title}</Text>
          <Text className="mt-1 text-sm text-slate-600">{item.message}</Text>
        </View>
        {!item.read ? <View className="mt-1 h-2.5 w-2.5 rounded-full bg-blue-500" /> : null}
      </View>
      <Text className="mt-2 text-xs text-slate-400">{new Date(item.createdAt).toLocaleDateString()}</Text>
    </Pressable>
  );
}
