import React from 'react';
import { View, Text } from 'react-native';

export const LeaveBalanceCard = ({ balance }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <Text className="text-textPrimary font-semibold text-base mb-3">{balance.leave_type_name}</Text>
    <View className="flex-row justify-between">
      <View>
        <Text className="text-textSecondary text-xs">Allocated</Text>
        <Text className="text-textPrimary font-medium">{balance.allocated}</Text>
      </View>
      <View>
        <Text className="text-textSecondary text-xs">Consumed</Text>
        <Text className="text-textPrimary font-medium">{balance.consumed}</Text>
      </View>
      <View>
        <Text className="text-textSecondary text-xs">Balance</Text>
        <Text className="text-primary font-bold">{balance.balance}</Text>
      </View>
    </View>
  </View>
);
