import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function ApplicationSettingsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Application Settings" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Application settings configuration center placeholder.
        </Text>
      </View>
    </View>
  );
}
