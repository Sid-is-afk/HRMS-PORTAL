import React from 'react';
import { View, Text } from 'react-native';

export const LogViewer = ({ log }) => {
  const getLevelColor = (level) => {
    switch(level) {
      case 'ERROR': return '#EF4444';
      case 'WARN': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <View className="border-b border-border py-2 flex-row">
      <Text className="text-textSecondary text-xs mr-2 w-20" numberOfLines={1}>{new Date(log.timestamp).toLocaleTimeString()}</Text>
      <Text className="text-xs font-bold w-12" style={{ color: getLevelColor(log.level) }}>{log.level}</Text>
      <Text className="text-textSecondary text-xs mr-2 w-16" numberOfLines={1}>[{log.source}]</Text>
      <Text className="text-textPrimary text-xs flex-1">{log.message}</Text>
    </View>
  );
};
