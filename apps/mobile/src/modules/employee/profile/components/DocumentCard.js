import React from 'react';
import { View, Text } from 'react-native';

export function DocumentCard({ document }) {
  return (
    <View className="bg-surface rounded-xl p-3 mb-2">
      <Text className="text-textPrimary font-semibold">{document.name}</Text>
      <Text className="text-textSecondary text-sm">{document.type}</Text>
      <Text className="text-textSecondary text-xs">Uploaded: {document.uploadedAt}</Text>
    </View>
  );
}
