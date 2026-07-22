import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Clock } from 'lucide-react-native';

export const ShiftCard = ({ shift, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <View className="flex-row items-center">
        <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: shift.color || '#3B82F6' }} />
        <Text className="text-textPrimary font-semibold text-base">{shift.name}</Text>
      </View>
      <StatusBadge status={shift.status} />
    </View>
    <View className="flex-row items-center mt-1">
      <Clock size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">{shift.startTime} - {shift.endTime}</Text>
      <Text className="text-textSecondary ml-4 text-sm">{shift.type}</Text>
    </View>
  </TouchableOpacity>
);
