import React from 'react';
import { View, Text } from 'react-native';

export function StatusBadge({ status }) {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-600';
  
  const statusStr = status?.toString().toUpperCase() || '';

  // Determine colors based on status content
  if (
    statusStr.includes('PRESENT') || 
    statusStr.includes('APPROVED') || 
    statusStr.includes('CLOCKED_IN') ||
    statusStr.includes('CLOCKED_OUT')
  ) {
    bgColor = 'bg-green-100';
    textColor = 'text-success';
  } else if (
    statusStr.includes('LATE') || 
    statusStr.includes('PENDING') || 
    statusStr.includes('HALF')
  ) {
    bgColor = 'bg-orange-100';
    textColor = 'text-warning';
  } else if (
    statusStr.includes('ABSENT') || 
    statusStr.includes('REJECTED')
  ) {
    bgColor = 'bg-red-100';
    textColor = 'text-error';
  } else if (
    statusStr.includes('LEAVE') || 
    statusStr.includes('HOLIDAY') || 
    statusStr.includes('WEEKEND')
  ) {
    bgColor = 'bg-blue-100';
    textColor = 'text-primary';
  }

  // Normalize status text for display
  const displayText = status?.replace('_', ' ') || 'Unknown';

  return (
    <View className={`${bgColor} px-3 py-1 rounded-full self-start`}>
      <Text className={`${textColor} text-xs font-bold uppercase tracking-wider`}>
        {displayText}
      </Text>
    </View>
  );
}
