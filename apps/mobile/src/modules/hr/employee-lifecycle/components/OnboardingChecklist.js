import React from 'react';
import { View, Text, Switch } from 'react-native';
import { CheckCircle, Circle } from 'lucide-react-native';

export const OnboardingChecklist = ({ task, onToggle }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center justify-between">
    <View className="flex-row items-center flex-1 pr-4">
      {task.is_completed ? (
        <CheckCircle size={20} color="#10B981" className="mr-3" />
      ) : (
        <Circle size={20} color="#CBD5E1" className="mr-3" />
      )}
      <View className="flex-1">
        <Text className={`text-base ${task.is_completed ? 'text-textSecondary line-through' : 'text-textPrimary font-medium'}`}>
          {task.task_name}
        </Text>
        <Text className="text-textSecondary text-xs mt-1">Due: {new Date(task.due_date).toLocaleDateString()} • {task.category}</Text>
      </View>
    </View>
    <Switch 
      value={task.is_completed} 
      onValueChange={(val) => onToggle(task.id, val)}
      trackColor={{ false: '#CBD5E1', true: '#10B981' }}
    />
  </View>
);
