import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { User, ChevronRight } from 'lucide-react-native';

export const PlatformUserCard = ({ user, onPress }) => {
  return (
    <Pressable 
      onPress={() => onPress && onPress(user)}
      className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <User size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold">{user.name}</Text>
          <View className={`px-2 py-1 rounded-full ${user.status === 'Active' ? 'bg-success/10' : 'bg-error/10'}`}>
            <Text className={`text-[10px] font-bold uppercase ${user.status === 'Active' ? 'text-[#10B981]' : 'text-[#EF4444]'}`}>{user.status}</Text>
          </View>
        </View>
        <Text className="text-textSecondary text-xs">{user.email}</Text>
        <Text className="text-textSecondary text-[10px] mt-1">Role: {user.role}</Text>
      </View>
      {onPress && <ChevronRight size={20} color="#94A3B8" className="ml-2" />}
    </Pressable>
  );
};
