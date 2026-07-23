import React from 'react';
import { View, Text } from 'react-native';

export function PermissionBadge({ permissionCode }) {
  // Normalize string for clean display
  const name = permissionCode?.replace('ROLE_', '').replace(/_/g, ' ');

  return (
    <View className="bg-slate-100 border border-slate-200 px-2 py-0.5 rounded m-0.5 self-start">
      <Text className="text-slate-700 text-xxs font-medium font-mono lowercase">
        {name || permissionCode}
      </Text>
    </View>
  );
}
