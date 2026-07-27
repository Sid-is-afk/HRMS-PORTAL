import React from 'react';
import { View, Text } from 'react-native';
import { Target, Clock, AlertTriangle, CheckCircle } from 'lucide-react-native';

export const GoalCard = ({ goal }) => {
  let Icon = Target;
  let color = '#64748B';
  let bgColor = 'bg-gray-100';

  if (goal.status === 'Completed') {
    Icon = CheckCircle;
    color = '#10B981';
    bgColor = 'bg-success/10';
  } else if (goal.status === 'At Risk') {
    Icon = AlertTriangle;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (goal.status === 'In Progress') {
    Icon = Clock;
    color = '#0EA5E9';
    bgColor = 'bg-primary/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row items-center mb-3">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bgColor}`}>
          <Icon size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-textPrimary font-semibold text-base">{goal.title}</Text>
          <Text className="text-textSecondary text-xs">Due: {new Date(goal.due_date).toLocaleDateString()}</Text>
        </View>
        <Text className={`font-bold ${color === '#64748B' ? 'text-textSecondary' : ''}`} style={color !== '#64748B' ? { color } : {}}>
          {goal.status}
        </Text>
      </View>
      <View className="w-full h-2 bg-surface rounded-full overflow-hidden">
        <View 
          className="h-full rounded-full" 
          style={{ width: `${goal.progress_percentage}%`, backgroundColor: color === '#64748B' ? '#94A3B8' : color }}
        />
      </View>
      <Text className="text-textSecondary text-xs mt-2 text-right">{goal.progress_percentage}% Completed</Text>
    </View>
  );
};
