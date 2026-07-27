import React from 'react';
import { View, ScrollView, Text, TextInput } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { Search } from 'lucide-react-native';
import { usePlatformStore } from '../store/platformStore';

export default function GlobalSearchScreen() {
  const { searchQuery, setSearchQuery } = usePlatformStore();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Global Search" showBack={true} />
      
      <View className="p-4 border-b border-border bg-white">
        <View className="flex-row items-center bg-surface p-3 rounded-lg border border-border">
          <Search size={20} color="#94A3B8" className="mr-2" />
          <TextInput
            placeholder="Search organizations, users, logs..."
            className="flex-1 text-textPrimary"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
        <Text className="text-textSecondary mt-10">Enter a query to search the global platform.</Text>
      </ScrollView>
    </View>
  );
}
