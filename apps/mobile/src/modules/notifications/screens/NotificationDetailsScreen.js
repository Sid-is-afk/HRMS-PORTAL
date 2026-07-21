import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function NotificationDetailsScreen({ navigation, route }) {
  const { notification } = route.params || {};

  if (!notification) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center justify-between px-5 py-4">
        <Text className="text-2xl font-semibold text-slate-900">Details</Text>
        <Pressable onPress={() => navigation.goBack()} className="rounded-full bg-slate-900 px-3 py-2">
          <Text className="text-sm font-medium text-white">Back</Text>
        </Pressable>
      </View>

      <View className="mx-5 rounded-2xl border border-slate-200 bg-white p-5">
        <Text className="text-lg font-semibold text-slate-900">{notification.title}</Text>
        <Text className="mt-2 text-sm text-slate-600">{notification.message}</Text>
        <View className="mt-4 rounded-xl bg-slate-100 p-3">
          <Text className="text-xs uppercase tracking-wide text-slate-500">Message type</Text>
          <Text className="mt-1 text-sm font-medium text-slate-800">{notification.type}</Text>
        </View>
      </View>
    </SafeAreaView>
  );
}
