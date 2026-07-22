import React from 'react';
import { View, Text } from 'react-native';

export function ContactCard({ contact }) {
  return (
    <View className="bg-surface rounded-xl p-3 mb-2">
      <Text className="text-textPrimary font-semibold">{contact.name}</Text>
      <Text className="text-textSecondary text-sm">{contact.relationship}</Text>
      <Text className="text-textSecondary text-sm">{contact.phone}</Text>
    </View>
  );
}
