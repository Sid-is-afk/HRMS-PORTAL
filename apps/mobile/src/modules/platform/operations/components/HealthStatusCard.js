import React from 'react';
import { View, Text } from 'react-native';
import { Server } from 'lucide-react-native';

export const HealthStatusCard = ({ service }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Healthy': return '#10B981';
      case 'Warning': return '#F59E0B';
      case 'Critical': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  const color = getStatusColor(service.status);

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${color}15` }}>
        <Server size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary text-sm font-bold mb-1">{service.name}</Text>
        <Text className="text-textSecondary text-xs">Response: {service.responseTimeMs}ms</Text>
      </View>
      <View className="items-end">
        <Text className="text-xs font-bold uppercase mb-1" style={{ color }}>{service.status}</Text>
        <Text className="text-textSecondary text-[9px]">{new Date(service.lastChecked).toLocaleTimeString()}</Text>
      </View>
    </View>
  );
};
