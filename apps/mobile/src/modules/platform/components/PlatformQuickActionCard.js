import React from 'react';
import { Pressable, Text, View } from 'react-native';

export const PlatformQuickActionCard = ({ label, icon: Icon, onPress }) => {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-white p-4 rounded-xl shadow-sm border border-border items-center justify-center flex-1 mx-1 mb-3"
    >
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mb-2">
        {Icon && <Icon size={20} color="#0EA5E9" />}
      </View>
      <Text className="text-textPrimary text-xs font-medium text-center">{label}</Text>
    </Pressable>
  );
};
