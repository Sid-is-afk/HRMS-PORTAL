import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { User } from 'lucide-react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';

export const LeaveApprovalCard = ({ approval, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
      <User size={20} color="#64748B" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold">{approval.employee_name}</Text>
      <Text className="text-textSecondary text-xs">{approval.leave_type_name} ({approval.days} days)</Text>
    </View>
    <StatusBadge status="PENDING" />
  </TouchableOpacity>
);
