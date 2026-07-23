import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

export const AttendanceExceptionCard = ({ exception, onPress }) => (
  <TouchableOpacity 
    className="bg-error/5 p-4 rounded-xl border border-error/20 mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-error/10 rounded-full items-center justify-center mr-4">
      <AlertCircle size={20} color="#EF4444" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold text-base">{exception.type}</Text>
      <Text className="text-textSecondary text-xs mt-1">Severity: {exception.severity}</Text>
    </View>
    <View className="bg-white px-3 py-1 rounded-full border border-border">
      <Text className="text-textSecondary text-xs font-medium">{exception.resolved ? 'Resolved' : 'Pending'}</Text>
    </View>
  </TouchableOpacity>
);
