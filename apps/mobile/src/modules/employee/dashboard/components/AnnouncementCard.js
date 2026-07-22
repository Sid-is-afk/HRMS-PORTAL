import React from 'react';
import { View, Text } from 'react-native';

export function AnnouncementCard({ announcement }) {
  let badgeColor = 'bg-blue-50';
  let badgeTextColor = 'text-primary';
  
  if (announcement.type?.toLowerCase() === 'urgent') {
    badgeColor = 'bg-red-50';
    badgeTextColor = 'text-error';
  } else if (announcement.type?.toLowerCase() === 'event') {
    badgeColor = 'bg-green-50';
    badgeTextColor = 'text-success';
  }

  return (
    <View className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-border">
      <View className="flex-row justify-between items-center mb-3">
        <View className={`${badgeColor} px-2.5 py-1 rounded-md`}>
          <Text className={`${badgeTextColor} text-[10px] font-bold uppercase tracking-widest font-inter`}>
            {announcement.type}
          </Text>
        </View>
        <Text className="text-textSecondary text-xs font-inter font-medium">{announcement.date}</Text>
      </View>
      <Text className="text-textPrimary text-base font-bold font-inter leading-6">
        {announcement.title}
      </Text>
    </View>
  );
}
