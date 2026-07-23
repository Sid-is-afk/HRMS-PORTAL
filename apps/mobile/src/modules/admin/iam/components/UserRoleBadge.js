import React from 'react';
import { View, Text } from 'react-native';

export function UserRoleBadge({ roleCode, roleName }) {
  let bgColor = 'bg-slate-100';
  let textColor = 'text-slate-700';
  let border = 'border border-slate-200';

  const code = roleCode?.toUpperCase() || '';

  if (code.includes('SUPER_ADMIN')) {
    bgColor = 'bg-purple-50';
    textColor = 'text-purple-700';
    border = 'border border-purple-200';
  } else if (code.includes('ADMIN')) {
    bgColor = 'bg-blue-50';
    textColor = 'text-blue-700';
    border = 'border border-blue-200';
  } else if (code.includes('HR')) {
    bgColor = 'bg-emerald-50';
    textColor = 'text-emerald-700';
    border = 'border border-emerald-200';
  } else if (code.includes('FINANCE')) {
    bgColor = 'bg-amber-50';
    textColor = 'text-amber-700';
    border = 'border border-amber-200';
  } else if (code.includes('EMPLOYEE')) {
    bgColor = 'bg-slate-50';
    textColor = 'text-slate-600';
    border = 'border border-slate-200';
  }

  return (
    <View className={`${bgColor} ${border} px-2.5 py-0.5 rounded-full align-center self-start`}>
      <Text className={`${textColor} text-xs font-semibold tracking-wide`}>
        {roleName || roleCode || 'No Role'}
      </Text>
    </View>
  );
}
