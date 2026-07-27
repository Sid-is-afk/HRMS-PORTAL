import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { UserPlus, Building, Briefcase } from 'lucide-react-native';

export const EmployeeConversionCard = ({ conversion, onPress }) => (
  <Pressable onPress={onPress} className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <View className="flex-row items-center mb-2">
      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
        <UserPlus size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{conversion.candidate_name}</Text>
        <Text className="text-textSecondary text-xs">Offer ID: {conversion.offer_id}</Text>
      </View>
    </View>
    <View className="flex-row items-center mt-2 flex-wrap">
      <View className="flex-row items-center mr-4 mb-2">
        <Building size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{conversion.assigned_department}</Text>
      </View>
      <View className="flex-row items-center mb-2">
        <Briefcase size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">Manager: {conversion.assigned_manager}</Text>
      </View>
    </View>
  </Pressable>
);
