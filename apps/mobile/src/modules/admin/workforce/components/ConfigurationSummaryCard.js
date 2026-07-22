import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const ConfigurationSummaryCard = ({ title, description, icon: Icon, onPress, status }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4"
    onPress={onPress}
  >
    <View className="flex-row items-start">
      <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mr-4">
        {Icon && <Icon size={24} color="#2563EB" />}
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-lg">{title}</Text>
        <Text className="text-textSecondary text-sm mt-1 mb-2">{description}</Text>
        {status && (
          <View className="self-start bg-success/10 px-2 py-1 rounded-md">
            <Text className="text-success text-xs font-medium">{status}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);
