import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';

export const AttendancePolicyCard = ({ policy, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-4 border border-border">
      <FileText size={20} color="#475569" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold text-base">{policy.name}</Text>
      <Text className="text-textSecondary text-xs mt-1">
        Grace In: {policy.graceIn}m • Grace Out: {policy.graceOut}m
      </Text>
    </View>
    <ChevronRight size={20} color="#94A3B8" />
  </TouchableOpacity>
);
