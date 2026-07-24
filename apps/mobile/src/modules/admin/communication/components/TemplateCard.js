import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText } from 'lucide-react-native';

export const TemplateCard = ({ template, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-3">
      <FileText size={20} color="#64748B" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold">{template.name}</Text>
      <Text className="text-textSecondary text-xs">{template.type_id}</Text>
    </View>
  </TouchableOpacity>
);
