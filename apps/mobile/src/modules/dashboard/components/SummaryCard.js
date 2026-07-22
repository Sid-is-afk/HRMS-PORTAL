import React from 'react';
import { View, Text } from 'react-native';
import { Check, AlertCircle, Calendar } from 'lucide-react-native';

export function SummaryCard({ title, data, type }) {
  if (type === 'attendance') {
    const isPresent = data?.status === 'Present';
    
    return (
      <View className="bg-white rounded-3xl p-5 flex-1 shadow-sm border border-border mr-2">
        <View className="flex-row items-center mb-4">
          <View className={`w-8 h-8 rounded-full items-center justify-center mr-2 ${isPresent ? 'bg-green-100' : 'bg-orange-100'}`}>
            {isPresent ? <Check size={16} color="#16A34A" /> : <AlertCircle size={16} color="#F59E0B" />}
          </View>
          <Text className="text-textSecondary text-xs font-semibold uppercase tracking-wider font-inter">{title}</Text>
        </View>
        
        <Text className="text-textPrimary text-2xl font-bold font-inter tracking-tight mb-2">
          {data?.status || 'N/A'}
        </Text>
        
        <View className="flex-row justify-between bg-surface p-2 rounded-lg border border-border">
          <View className="items-center flex-1 border-r border-border">
            <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-0.5">In</Text>
            <Text className="text-textPrimary text-xs font-semibold">{data?.checkIn || '--:--'}</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mb-0.5">Out</Text>
            <Text className="text-textPrimary text-xs font-semibold">{data?.checkOut || '--:--'}</Text>
          </View>
        </View>
      </View>
    );
  }

  if (type === 'leave') {
    return (
      <View className="bg-white rounded-3xl p-5 flex-1 shadow-sm border border-border ml-2 justify-between">
        <View className="flex-row items-center mb-4">
          <View className="w-8 h-8 rounded-full items-center justify-center mr-2 bg-blue-100">
             <Calendar size={16} color="#2563EB" />
          </View>
          <Text className="text-textSecondary text-xs font-semibold uppercase tracking-wider font-inter">{title}</Text>
        </View>
        
        <View className="space-y-3">
          <View className="flex-row justify-between items-center">
            <Text className="text-textSecondary text-sm font-inter font-medium">Annual</Text>
            <View className="bg-blue-50 px-3 py-1 rounded-full border border-blue-100">
              <Text className="text-primary font-bold font-inter text-xs">{data?.annual || 0} left</Text>
            </View>
          </View>
          
          <View className="flex-row justify-between items-center">
            <Text className="text-textSecondary text-sm font-inter font-medium">Sick</Text>
            <View className="bg-orange-50 px-3 py-1 rounded-full border border-orange-100">
              <Text className="text-warning font-bold font-inter text-xs">{data?.sick || 0} left</Text>
            </View>
          </View>
        </View>
      </View>
    );
  }

  return null;
}
