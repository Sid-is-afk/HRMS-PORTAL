import React from 'react';
import { View, Text } from 'react-native';
import { Users } from 'lucide-react-native';
import { useAudienceSelector } from '../hooks/useAudienceSelector';

export const AudiencePreview = ({ filter }) => {
  const { audiencePreview, isLoading } = useAudienceSelector(filter);

  return (
    <View className="bg-primary/5 p-4 rounded-xl border border-primary/20 mb-3 flex-row items-center">
      <Users size={20} color="#0EA5E9" className="mr-3" />
      <View className="flex-1">
        <Text className="text-textPrimary font-medium">Estimated Audience Size</Text>
        {isLoading ? (
          <Text className="text-textSecondary text-xs">Calculating...</Text>
        ) : (
          <Text className="text-textSecondary text-xs">
            {audiencePreview?.count || 0} employees targeted
          </Text>
        )}
      </View>
    </View>
  );
};
