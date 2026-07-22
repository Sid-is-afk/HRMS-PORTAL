import React, { memo } from 'react';
import { View, Text } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Clock, CheckCircle2, XCircle, AlertTriangle } from 'lucide-react-native';

export const AttendanceHistoryItem = memo(function AttendanceHistoryItem({ record }) {
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const statusStr = record.status?.toString().toUpperCase() || '';
  let borderColor = 'border-l-gray-300';
  
  if (statusStr.includes('PRESENT') || statusStr.includes('CLOCKED')) {
    borderColor = 'border-l-success';
  } else if (statusStr.includes('LATE') || statusStr.includes('HALF')) {
    borderColor = 'border-l-warning';
  } else if (statusStr.includes('ABSENT')) {
    borderColor = 'border-l-error';
  }

  return (
    <View className={`bg-white p-4 rounded-2xl border border-border border-l-4 ${borderColor} mb-4 shadow-sm overflow-hidden`}>
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-textPrimary font-bold text-base font-inter">{formatDate(record.date)}</Text>
        <StatusBadge status={record.status} />
      </View>
      
      <View className="flex-row justify-between bg-surface p-3 rounded-xl border border-border">
        <View className="items-center flex-1 border-r border-border">
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-1 font-inter">Clock In</Text>
          <Text className="text-textPrimary text-sm font-semibold font-inter">{formatTime(record.checkIn)}</Text>
        </View>
        <View className="items-center flex-1 border-r border-border">
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-1 font-inter">Clock Out</Text>
          <Text className="text-textPrimary text-sm font-semibold font-inter">{formatTime(record.checkOut)}</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-1 font-inter">Total</Text>
          <Text className="text-primary text-sm font-bold font-inter">{record.hoursWorked}h</Text>
        </View>
      </View>
    </View>
  );
});
