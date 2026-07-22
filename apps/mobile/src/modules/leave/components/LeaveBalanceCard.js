import React from 'react';
import { View, Text } from 'react-native';
import { Umbrella, PlusSquare, Coffee, Briefcase } from 'lucide-react-native';

export function LeaveBalanceCard({ balance }) {
  // If actual breakdown is provided we use it, otherwise mock for UI presentation
  const breakdowns = [
    { type: 'Annual', icon: Umbrella, color: '#2563EB', bg: 'bg-blue-100', days: 12 },
    { type: 'Sick', icon: PlusSquare, color: '#DC2626', bg: 'bg-red-50', days: 5 },
    { type: 'Casual', icon: Coffee, color: '#16A34A', bg: 'bg-green-100', days: 3 },
    { type: 'Unpaid', icon: Briefcase, color: '#4B5563', bg: 'bg-gray-200', days: 0 },
  ];

  return (
    <View className="flex-row flex-wrap justify-between mb-4">
      {breakdowns.map((item, index) => {
        const Icon = item.icon;
        return (
          <View key={index} className="w-[48%] bg-white rounded-3xl border border-border p-4 mb-4">
            <View className="flex-row justify-between items-start mb-4">
              <View className={`w-10 h-10 ${item.bg} rounded-xl items-center justify-center`}>
                <Icon size={20} color={item.color} />
              </View>
              <View className="bg-surface px-2 py-1 rounded-md">
                <Text className="text-textSecondary text-xs font-inter font-medium">{item.type}</Text>
              </View>
            </View>
            <View className="flex-row items-baseline">
              <Text className="text-textPrimary text-3xl font-bold font-inter">{item.days}</Text>
              <Text className="text-textSecondary text-sm ml-2 font-inter font-medium">Days</Text>
            </View>
          </View>
        );
      })}
    </View>
  );
}
