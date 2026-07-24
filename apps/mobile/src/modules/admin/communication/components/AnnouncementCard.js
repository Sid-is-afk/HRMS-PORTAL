import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { MessageSquare, Calendar } from 'lucide-react-native';

export const AnnouncementCard = ({ announcement, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-textPrimary font-semibold text-base flex-1 mr-2" numberOfLines={1}>
        {announcement.title}
      </Text>
      <StatusBadge status={announcement.status} />
    </View>
    <View className="flex-row items-center mt-2">
      <MessageSquare size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm mr-4">{announcement.type_id}</Text>
      <Calendar size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">{announcement.created_at}</Text>
    </View>
  </TouchableOpacity>
);
