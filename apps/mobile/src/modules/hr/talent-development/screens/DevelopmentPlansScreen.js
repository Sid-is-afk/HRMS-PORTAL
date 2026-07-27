import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function DevelopmentPlansScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Development Plans" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Individual development plan module placeholder.
        </Text>
      </View>
    </View>
  );
}
