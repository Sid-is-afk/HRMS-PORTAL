import React from 'react';
import { View, Text } from 'react-native';
import { Briefcase, AlertTriangle, UserCheck } from 'lucide-react-native';

export const CaseCard = ({ hrCase }) => {
  const isEscalated = hrCase.status === 'Escalated' || hrCase.priority === 'Urgent';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row justify-between items-start mb-2">
        <View className="flex-row items-center flex-1 pr-2">
          {isEscalated ? (
            <AlertTriangle size={18} color="#EF4444" className="mr-2" />
          ) : (
            <Briefcase size={18} color="#64748B" className="mr-2" />
          )}
          <Text className="text-textPrimary font-semibold text-base flex-1">{hrCase.title}</Text>
        </View>
        <View className={`px-2 py-1 rounded ${isEscalated ? 'bg-error/10' : 'bg-surface'}`}>
          <Text className={`text-xs font-bold ${isEscalated ? 'text-error' : 'text-textSecondary'}`}>{hrCase.status}</Text>
        </View>
      </View>
      
      <View className="flex-row items-center mt-2">
        <UserCheck size={14} color="#94A3B8" className="mr-1" />
        <Text className="text-textSecondary text-xs">
          {hrCase.assignee_id ? `Assigned: ${hrCase.assignee_id}` : 'Unassigned'}
        </Text>
      </View>
    </View>
  );
};
