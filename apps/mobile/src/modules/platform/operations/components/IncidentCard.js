import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle, Info } from 'lucide-react-native';

export const IncidentCard = ({ incident }) => {
  const isCritical = incident.severity === 'Critical' || incident.severity === 'High';
  const color = isCritical ? '#EF4444' : '#F59E0B';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: `${color}15` }}>
          {isCritical ? <AlertTriangle size={16} color={color} /> : <Info size={16} color={color} />}
        </View>
        <View className="flex-1">
          <Text className="text-textPrimary text-sm font-bold">{incident.title}</Text>
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mt-1">{incident.status} • {incident.severity}</Text>
        </View>
      </View>
      <View className="bg-surface p-2 rounded flex-row justify-between items-center">
        <Text className="text-textSecondary text-xs">Affected: {incident.affectedServices.join(', ')}</Text>
        <Text className="text-textSecondary text-[10px]">{new Date(incident.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};
