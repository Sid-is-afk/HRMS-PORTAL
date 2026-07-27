import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function PerformanceReviewsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Performance Reviews" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Performance reviews module placeholder.
        </Text>
      </View>
    </View>
  );
}
