import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Filter } from 'lucide-react-native';

export const AnalyticsFilterBar = () => {
  const filters = ['Global', 'Engineering', 'Sales', 'Marketing', 'Last 90 Days'];

  return (
    <View className="bg-white py-3 border-b border-border">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        <View className="flex-row items-center mr-3 bg-surface p-2 rounded">
          <Filter size={16} color="#64748B" className="mr-1" />
          <Text className="text-textSecondary text-sm font-medium">Filters</Text>
        </View>
        {filters.map((f, i) => (
          <Pressable key={i} className="bg-surface px-4 py-2 rounded-full mr-2 border border-border">
            <Text className="text-textPrimary text-sm">{f}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
