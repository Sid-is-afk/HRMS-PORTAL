import React from 'react';
import { View, Text } from 'react-native';
import { ShieldAlert, ShieldCheck } from 'lucide-react-native';

export const ProbationCard = ({ probation }) => {
  const isActive = probation.status === 'Active';
  
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isActive ? 'bg-warning/10' : 'bg-success/10'}`}>
        {isActive ? <ShieldAlert size={20} color="#F59E0B" /> : <ShieldCheck size={20} color="#10B981" />}
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{probation.employee_id}</Text>
        <Text className="text-textSecondary text-sm mb-1">
          {isActive ? `Ends: ${new Date(probation.end_date).toLocaleDateString()}` : 'Completed'}
        </Text>
        {probation.review_notes ? (
          <Text className="text-textSecondary text-xs bg-surface p-2 rounded">
            {probation.review_notes}
          </Text>
        ) : null}
      </View>
    </View>
  );
};
