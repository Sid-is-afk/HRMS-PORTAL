import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';

export function LoadingOverlay({ visible, message = "Loading..." }) {
  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFill} className="bg-white/90 items-center justify-center z-50">
      <View className="bg-white p-6 rounded-2xl shadow-md items-center border border-border min-w-[140px]">
        <ActivityIndicator size="large" color="#2563EB" className="mb-4" />
        <Text className="text-textPrimary font-inter font-semibold text-sm">{message}</Text>
      </View>
    </View>
  );
}
