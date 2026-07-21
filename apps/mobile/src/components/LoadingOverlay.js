import React from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';

export function LoadingOverlay({ visible }) {
  if (!visible) return null;
  return (
    <View style={StyleSheet.absoluteFill} className="bg-white/80 items-center justify-center z-50">
      <ActivityIndicator size="large" color="#2563EB" />
    </View>
  );
}
