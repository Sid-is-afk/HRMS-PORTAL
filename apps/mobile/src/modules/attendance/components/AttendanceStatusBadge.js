import React from 'react';
import { View, Text } from 'react-native';

export function AttendanceStatusBadge({ status }) {
  let bgColor = 'bg-gray-100';
  let textColor = 'text-gray-600';
  
  if (status === 'Present' || status === 'CLOCKED_IN' || status === 'CLOCKED_OUT') {
    bgColor = 'bg-green-100';
    textColor = 'text-success';
  } else if (status === 'Late' || status === 'Half Day') {
    bgColor = 'bg-orange-100';
    textColor = 'text-warning';
  } else if (status === 'Absent') {
    bgColor = 'bg-red-100';
    textColor = 'text-error';
  } else if (status === 'On Leave' || status === 'Weekend' || status === 'Holiday') {
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
