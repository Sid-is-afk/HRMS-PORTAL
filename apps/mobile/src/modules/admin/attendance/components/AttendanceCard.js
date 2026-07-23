import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Clock } from 'lucide-react-native';

export const AttendanceCard = ({ record, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-textPrimary font-semibold text-base">{record.attendance_date}</Text>
      <StatusBadge status={record.status} />
    </View>
    <View className="flex-row items-center mt-1">
      <Clock size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">In: {record.clock_in} - Out: {record.clock_out}</Text>
    </View>
  </TouchableOpacity>
);
