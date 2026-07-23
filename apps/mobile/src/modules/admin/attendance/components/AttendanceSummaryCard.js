import React from 'react';
import { View, Text } from 'react-native';

export const AttendanceSummaryCard = ({ summary }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4 flex-row flex-wrap justify-between">
    <View className="w-[48%] mb-4">
      <Text className="text-textSecondary text-xs">Total Present</Text>
      <Text className="text-textPrimary font-bold text-lg">{summary?.totalPresent || 0}</Text>
    </View>
    <View className="w-[48%] mb-4">
      <Text className="text-textSecondary text-xs">Total Absent</Text>
      <Text className="text-textPrimary font-bold text-lg">{summary?.totalAbsent || 0}</Text>
    </View>
    <View className="w-[48%]">
      <Text className="text-textSecondary text-xs">Late Arrivals</Text>
      <Text className="text-error font-bold text-lg">{summary?.totalLateArrivals || 0}</Text>
    </View>
    <View className="w-[48%]">
      <Text className="text-textSecondary text-xs">Early Exits</Text>
      <Text className="text-warning font-bold text-lg">{summary?.totalEarlyExits || 0}</Text>
    </View>
  </View>
);
