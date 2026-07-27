import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function PermissionExplorerScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Permission Explorer" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4">Permission Matrix Placeholder</Text>
        <Text className="text-textSecondary text-center">A comprehensive view of all modular permissions available across HR, Admin, and Platform domains will be rendered here.</Text>
      </ScrollView>
    </View>
  );
}
