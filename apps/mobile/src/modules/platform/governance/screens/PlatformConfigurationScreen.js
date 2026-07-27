import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function PlatformConfigurationScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Configuration Workspace" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16, alignItems: 'center', justifyContent: 'center' }}>
        <Text className="text-textPrimary text-lg font-bold mb-4 mt-20">Settings Placeholder</Text>
        <Text className="text-textSecondary text-center">
          Localization, Branding, Compliance, and Maintenance forms will be orchestrated from this central routing hub.
        </Text>
      </ScrollView>
    </View>
  );
}
