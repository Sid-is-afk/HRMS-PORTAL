import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';

export const HolidayCard = ({ holiday, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
      <Calendar size={20} color="#2563EB" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold text-base">{holiday.name}</Text>
      <Text className="text-textSecondary text-sm">{holiday.date}</Text>
    </View>
    <View className="bg-background px-3 py-1 rounded-full">
      <Text className="text-textSecondary text-xs font-medium">{holiday.type}</Text>
    </View>
  </TouchableOpacity>
);
