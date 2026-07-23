import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Calendar } from 'lucide-react-native';

export const LeaveCard = ({ request, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-textPrimary font-semibold text-base">{request.leave_type_name}</Text>
      <StatusBadge status={request.status} />
    </View>
    <View className="flex-row items-center mt-1">
      <Calendar size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">{request.start_date} to {request.end_date}</Text>
    </View>
    <Text className="text-textSecondary text-xs mt-2" numberOfLines={1}>{request.reason}</Text>
  </TouchableOpacity>
);
