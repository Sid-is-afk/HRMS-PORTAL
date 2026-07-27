import React from 'react';
import { View, Text } from 'react-native';

export const PlatformSummaryCard = ({ title, value, status, icon: Icon }) => {
  let statusColor = '#64748B'; // default
  if (status === 'Healthy' || status === 'Operational') statusColor = '#10B981';
  if (status === 'Degraded') statusColor = '#F59E0B';
  if (status === 'Offline') statusColor = '#EF4444';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border w-[48%] mb-4">
      <View className="flex-row items-center mb-2">
        {Icon && <Icon size={16} color="#64748B" className="mr-2" />}
        <Text className="text-textSecondary text-xs">{title}</Text>
      </View>
      <Text className="text-textPrimary text-2xl font-bold mb-1">{value}</Text>
      {status && (
        <Text style={{ color: statusColor }} className="text-xs font-medium">{status}</Text>
      )}
    </View>
  );
};
