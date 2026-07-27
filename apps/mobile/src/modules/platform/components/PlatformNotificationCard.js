import React from 'react';
import { View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';

export const PlatformNotificationCard = ({ notification }) => {
  return (
    <View className={`p-4 rounded-xl shadow-sm border border-border mb-3 flex-row ${notification.read ? 'bg-surface' : 'bg-white'}`}>
      <View className="mr-3">
        <Bell size={20} color={notification.read ? '#94A3B8' : '#0EA5E9'} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between mb-1">
          <Text className="text-textPrimary text-sm font-bold">{notification.title}</Text>
          <Text className="text-textSecondary text-xs">{new Date(notification.date).toLocaleDateString()}</Text>
        </View>
        <Text className="text-textSecondary text-sm">{notification.message}</Text>
      </View>
    </View>
  );
};
