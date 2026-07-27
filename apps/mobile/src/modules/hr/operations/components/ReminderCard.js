import React from 'react';
import { View, Text } from 'react-native';
import { Bell, Calendar } from 'lucide-react-native';

export const ReminderCard = ({ reminder }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
      <Bell size={20} color="#64748B" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold">{reminder.title}</Text>
      <View className="flex-row items-center mt-1">
        <Calendar size={12} color="#94A3B8" className="mr-1" />
        <Text className="text-textSecondary text-xs">Due: {new Date(reminder.due_date).toLocaleDateString()} • {reminder.type}</Text>
      </View>
    </View>
    <Text className="text-textSecondary text-xs font-bold">{reminder.status}</Text>
  </View>
);
