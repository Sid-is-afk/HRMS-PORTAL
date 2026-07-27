import React from 'react';
import { View, Text } from 'react-native';
import { ShieldCheck, ShieldAlert, ShieldX } from 'lucide-react-native';

export const ComplianceBadge = ({ record }) => {
  let Icon = ShieldCheck;
  let color = '#10B981';
  let bgColor = 'bg-success/10';

  if (record.status === 'Non-Compliant') {
    Icon = ShieldX;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (record.status === 'Expiring Soon') {
    Icon = ShieldAlert;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bgColor}`}>
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{record.requirement_name}</Text>
        <Text className="text-textSecondary text-sm mb-1">
          Expires: {new Date(record.expiry_date).toLocaleDateString()}
        </Text>
      </View>
      <View className={`px-2 py-1 rounded ${bgColor}`}>
        <Text style={{ color }} className="text-xs font-bold">{record.status}</Text>
      </View>
    </View>
  );
};
