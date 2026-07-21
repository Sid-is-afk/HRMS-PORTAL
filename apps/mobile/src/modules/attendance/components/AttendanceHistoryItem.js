import React from 'react';
import { View, Text } from 'react-native';
import { AttendanceStatusBadge } from './AttendanceStatusBadge';

export function AttendanceHistoryItem({ record }) {
  const formatTime = (isoString) => {
    if (!isoString) return '--:--';
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    return new Date(dateString).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  };

  return (
    <View className="bg-white p-4 rounded-xl border border-border mb-3">
      <View className="flex-row justify-between items-center mb-3">
        <Text className="text-textPrimary font-bold text-base">{formatDate(record.date)}</Text>
        <AttendanceStatusBadge status={record.status} />
      </View>
      
      <View className="flex-row justify-between bg-surface p-2 rounded-lg border border-border">
        <View className="items-center flex-1 border-r border-border">
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-0.5">In</Text>
          <Text className="text-textPrimary text-xs font-semibold">{formatTime(record.checkIn)}</Text>
        </View>
        <View className="items-center flex-1 border-r border-border">
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-0.5">Out</Text>
          <Text className="text-textPrimary text-xs font-semibold">{formatTime(record.checkOut)}</Text>
        </View>
        <View className="items-center flex-1">
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-0.5">Hours</Text>
          <Text className="text-primary text-xs font-bold">{record.hoursWorked}h</Text>
        </View>
      </View>
    </View>
  );
}
