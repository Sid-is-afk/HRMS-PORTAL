import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function ConfirmationCenterScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Confirmation Center" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Confirmation center placeholder.
        </Text>
      </View>
    </View>
  );
}
