import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Bell } from 'lucide-react-native';
import { useNavigation } from '@react-navigation/native';

export function TopHeader() {
  const navigation = useNavigation();

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-border">
      <View className="flex-row items-center space-x-2">
        {/* Placeholder for User Avatar or Company Logo */}
        <View className="w-8 h-8 bg-surface rounded-full overflow-hidden mr-2">
           <Image 
             source={{ uri: 'https://ui-avatars.com/api/?name=W+F&background=2563EB&color=fff' }} 
             className="w-full h-full"
           />
        </View>
        <Text className="text-primary font-bold text-xl font-inter tracking-tight">WorkForce</Text>
      </View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Notifications')}
        activeOpacity={0.6}
        className="p-2 -mr-2"
      >
        <Bell size={24} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}
