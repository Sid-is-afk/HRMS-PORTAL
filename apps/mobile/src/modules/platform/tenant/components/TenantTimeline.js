import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2, Clock } from 'lucide-react-native';

export const TenantTimeline = ({ events }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border">
      <Text className="text-lg font-bold text-textPrimary mb-4">Lifecycle Events</Text>
      {events.map((ev, index) => (
        <View key={ev.id} className="flex-row mb-4">
          <View className="items-center mr-3">
            {index === events.length - 1 ? (
              <Clock size={20} color="#0EA5E9" />
            ) : (
              <CheckCircle2 size={20} color="#10B981" />
            )}
            {index !== events.length - 1 && <View className="w-px h-full bg-border mt-1" />}
          </View>
          <View className="flex-1 pb-4">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-textPrimary font-semibold text-sm">{ev.status}</Text>
              <Text className="text-textSecondary text-xs">{new Date(ev.timestamp).toLocaleDateString()}</Text>
            </View>
            <Text className="text-textSecondary text-xs mb-1">Actor: {ev.actor}</Text>
            <Text className="text-textPrimary text-xs">{ev.notes}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
