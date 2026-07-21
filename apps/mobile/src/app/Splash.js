import React from 'react';
import { View, Text, ActivityIndicator } from 'react-native';

export default function Splash() {
  return (
    <View className="flex-1 items-center justify-center bg-primary">
      <Text className="text-white text-3xl font-bold font-inter mb-4">HRMS Portal</Text>
      <ActivityIndicator size="large" color="#FFFFFF" />
    </View>
  );
}
