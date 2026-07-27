import React from 'react';
import { View, Text } from 'react-native';
import { Shield } from 'lucide-react-native';

export const RoleCard = ({ role }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Shield size={20} color="#6366F1" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold">{role.name}</Text>
          <Text className="text-textSecondary text-xs">{role.assignedUsers} Users</Text>
        </View>
        <Text className="text-textSecondary text-xs">{role.description}</Text>
      </View>
    </View>
  );
};
