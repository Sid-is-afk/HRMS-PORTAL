import React from 'react';
import { View, Text } from 'react-native';

export const TenantStatusBadge = ({ status }) => {
  let bgColor = 'bg-surface';
  let textColor = '#64748B';

  if (status === 'Active') {
    bgColor = 'bg-success/10';
    textColor = '#10B981';
  } else if (status === 'Provisioning' || status === 'Prospect') {
    bgColor = 'bg-primary/10';
    textColor = '#0EA5E9';
  } else if (status === 'Suspended' || status === 'Maintenance') {
    bgColor = 'bg-warning/10';
    textColor = '#F59E0B';
  } else if (status === 'Archived' || status === 'Deleted') {
    bgColor = 'bg-error/10';
    textColor = '#EF4444';
  }

  return (
    <View className={`px-2 py-1 rounded-full ${bgColor}`}>
      <Text style={{ color: textColor }} className="text-[10px] font-bold uppercase tracking-wider">{status}</Text>
    </View>
  );
};
