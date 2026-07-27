import React from 'react';
import { View, Text } from 'react-native';
import { FileText, AlertCircle, CheckCircle, Clock } from 'lucide-react-native';

export const ServiceRequestCard = ({ request }) => {
  let Icon = FileText;
  let color = '#64748B';
  let bgColor = 'bg-gray-100';

  if (request.status === 'Open') {
    Icon = AlertCircle;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  } else if (request.status === 'In Progress') {
    Icon = Clock;
    color = '#0EA5E9';
    bgColor = 'bg-primary/10';
  } else if (request.status === 'Resolved' || request.status === 'Closed') {
    Icon = CheckCircle;
    color = '#10B981';
    bgColor = 'bg-success/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row items-center mb-2">
        <View className={`w-10 h-10 rounded-full items-center justify-center mr-3 ${bgColor}`}>
          <Icon size={20} color={color} />
        </View>
        <View className="flex-1">
          <Text className="text-textPrimary font-semibold text-base">{request.id} - {request.category}</Text>
          <Text className="text-textSecondary text-xs">Employee: {request.employee_id}</Text>
        </View>
      </View>
      <View className="flex-row justify-between items-center mt-2 border-t border-border/50 pt-2">
        <Text className="text-textSecondary text-xs">Priority: {request.priority}</Text>
        <Text style={{ color }} className="text-xs font-bold">{request.status}</Text>
      </View>
    </View>
  );
};
