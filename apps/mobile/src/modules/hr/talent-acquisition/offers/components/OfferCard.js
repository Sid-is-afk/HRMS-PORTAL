import React from 'react';
import { View, Text, Pressable } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { MapPin, Building, Briefcase } from 'lucide-react-native';

export const OfferCard = ({ offer, onPress }) => (
  <Pressable onPress={onPress} className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
    <View className="flex-row justify-between items-start mb-2">
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-base">{offer.candidate_name}</Text>
        <Text className="text-textSecondary text-sm">{offer.job_title}</Text>
      </View>
      <StatusBadge status={offer.status} />
    </View>
    <View className="flex-row items-center mt-2 flex-wrap">
      <View className="flex-row items-center mr-4 mb-2">
        <Building size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{offer.department}</Text>
      </View>
      <View className="flex-row items-center mr-4 mb-2">
        <MapPin size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{offer.location}</Text>
      </View>
      <View className="flex-row items-center mb-2">
        <Briefcase size={14} color="#64748B" className="mr-1" />
        <Text className="text-textSecondary text-xs">{offer.employment_type}</Text>
      </View>
    </View>
  </Pressable>
);
