import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { Pencil } from 'lucide-react-native';

export function ProfileHeader({ profile, onEditPress }) {
  // Using a fallback image if none exists
  const avatarUrl = profile?.avatarUrl || `https://ui-avatars.com/api/?name=${profile?.firstName || 'User'}+${profile?.lastName || ''}&background=2563EB&color=fff&size=200`;

  return (
    <View className="bg-white rounded-3xl border border-border p-6 mb-4 items-center shadow-sm">
      <View className="relative mb-4">
        <View className="w-24 h-24 rounded-full bg-surface overflow-hidden border-2 border-white shadow-sm">
          <Image source={{ uri: avatarUrl }} className="w-full h-full" />
        </View>
        <TouchableOpacity 
          onPress={onEditPress}
          activeOpacity={0.8}
          className="absolute bottom-0 right-0 w-8 h-8 bg-primary rounded-full items-center justify-center border-2 border-white"
        >
          <Pencil size={14} color="#FFFFFF" />
        </TouchableOpacity>
      </View>
      
      <Text className="text-textPrimary text-2xl font-bold font-inter tracking-tight">
        {profile?.firstName} {profile?.lastName}
      </Text>
      <Text className="text-textSecondary text-sm font-inter mt-1 mb-3">
        {profile?.designation}
      </Text>
      
      <View className="bg-green-100 px-3 py-1.5 rounded-full">
        <Text className="text-success text-xs font-bold font-inter tracking-wide">
          Active Employee
        </Text>
      </View>
    </View>
  );
}
