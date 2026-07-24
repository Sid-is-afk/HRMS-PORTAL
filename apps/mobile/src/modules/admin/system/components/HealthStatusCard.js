import React from 'react';
import { View, Text } from 'react-native';
import { Activity, AlertTriangle, XCircle } from 'lucide-react-native';

export const HealthStatusCard = ({ metric }) => {
  const isHealthy = metric.status === 'healthy';
  const isDegraded = metric.status === 'degraded';
  const isDown = metric.status === 'down';
  
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${isHealthy ? 'bg-success/10' : isDegraded ? 'bg-warning/10' : 'bg-error/10'}`}>
        {isHealthy && <Activity size={20} color="#10B981" />}
        {isDegraded && <AlertTriangle size={20} color="#F59E0B" />}
        {isDown && <XCircle size={20} color="#EF4444" />}
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold">{metric.service_name}</Text>
        <View className="flex-row items-center mt-1">
          <Text className={`text-xs font-medium mr-2 ${isHealthy ? 'text-success' : isDegraded ? 'text-warning' : 'text-error'}`}>
            {metric.status.toUpperCase()}
          </Text>
          <Text className="text-textSecondary text-xs">{metric.latency_ms}ms latency</Text>
        </View>
      </View>
    </View>
  );
};
