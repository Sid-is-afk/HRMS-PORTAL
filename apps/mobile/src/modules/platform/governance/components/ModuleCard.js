import React from 'react';
import { View, Text } from 'react-native';
import { Package } from 'lucide-react-native';

export const ModuleCard = ({ module }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Package size={20} color={module.isCore ? '#6366F1' : '#0EA5E9'} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold mr-2">{module.name}</Text>
          {module.isCore && (
            <View className="px-2 py-0.5 rounded-full bg-[#6366F1]/10">
              <Text className="text-[9px] text-[#6366F1] uppercase font-bold tracking-wider">Core</Text>
            </View>
          )}
        </View>
        <Text className="text-textSecondary text-xs">{module.description}</Text>
        <Text className="text-textSecondary text-[10px] mt-1">Status: {module.status}</Text>
      </View>
    </View>
  );
};
