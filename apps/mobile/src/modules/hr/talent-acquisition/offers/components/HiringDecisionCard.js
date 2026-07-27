import React from 'react';
import { View, Text } from 'react-native';
import { UserCheck, UserX, Clock, AlertTriangle } from 'lucide-react-native';

export const HiringDecisionCard = ({ decision }) => {
  let Icon = Clock;
  let color = '#64748B';
  let bgColor = 'bg-gray-100';

  if (decision.decision === 'Approve') {
    Icon = UserCheck;
    color = '#10B981';
    bgColor = 'bg-success/10';
  } else if (decision.decision === 'Reject') {
    Icon = UserX;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (decision.decision === 'Escalate') {
    Icon = AlertTriangle;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-start">
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bgColor}`}>
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary font-semibold">{decision.decision}</Text>
          <Text className="text-textSecondary text-xs">{new Date(decision.decided_at).toLocaleDateString()}</Text>
        </View>
        <Text className="text-textSecondary text-xs mb-2">By {decision.decided_by}</Text>
        {decision.notes ? (
          <View className="bg-surface p-2 rounded border border-border">
            <Text className="text-textSecondary text-sm">{decision.notes}</Text>
          </View>
        ) : null}
      </View>
    </View>
  );
};
