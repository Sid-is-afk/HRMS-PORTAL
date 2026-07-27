import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { PlayCircle, CheckCircle } from 'lucide-react-native';

export const LearningCard = ({ course, onPress }) => {
  const isCompleted = course.status === 'Completed';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row items-center justify-between mb-2">
        <View className="bg-surface px-2 py-1 rounded">
          <Text className="text-textSecondary text-xs">{course.category}</Text>
        </View>
        {course.is_mandatory && (
          <View className="bg-error/10 px-2 py-1 rounded">
            <Text className="text-error text-xs font-bold">Mandatory</Text>
          </View>
        )}
      </View>
      
      <Text className="text-textPrimary font-semibold text-lg mb-1">{course.title}</Text>
      <Text className="text-textSecondary text-xs mb-3">{course.duration_minutes} mins</Text>

      <View className="flex-row items-center justify-between">
        <View className="flex-1 mr-4">
          <View className="w-full h-1.5 bg-surface rounded-full overflow-hidden">
            <View 
              className="h-full bg-primary rounded-full" 
              style={{ width: `${course.completion_percentage}%` }}
            />
          </View>
        </View>
        <Pressable onPress={onPress} className="flex-row items-center">
          {isCompleted ? (
            <>
              <CheckCircle size={16} color="#10B981" className="mr-1" />
              <Text className="text-success text-sm font-medium">Done</Text>
            </>
          ) : (
            <>
              <PlayCircle size={16} color="#0EA5E9" className="mr-1" />
              <Text className="text-primary text-sm font-medium">
                {course.status === 'Not Started' ? 'Start' : 'Resume'}
              </Text>
            </>
          )}
        </Pressable>
      </View>
    </View>
  );
};
