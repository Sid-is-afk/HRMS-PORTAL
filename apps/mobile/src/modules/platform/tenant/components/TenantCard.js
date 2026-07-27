import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { TenantStatusBadge } from './TenantStatusBadge';
import { Building, ChevronRight } from 'lucide-react-native';

export const TenantCard = ({ tenant, onPress }) => {
  return (
    <Pressable 
      onPress={() => onPress(tenant)}
      className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Building size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold">{tenant.name}</Text>
          <TenantStatusBadge status={tenant.status} />
        </View>
        <Text className="text-textSecondary text-xs mb-1">Code: {tenant.orgCode} | Industry: {tenant.industry}</Text>
        <Text className="text-textSecondary text-[10px]">Since: {new Date(tenant.createdAt).toLocaleDateString()}</Text>
      </View>
      <ChevronRight size={20} color="#94A3B8" className="ml-2" />
    </Pressable>
  );
};
