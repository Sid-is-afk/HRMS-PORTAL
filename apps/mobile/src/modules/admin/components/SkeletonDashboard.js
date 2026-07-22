import React from 'react';
import { View, StyleSheet, ActivityIndicator } from 'react-native';
import { Text } from 'react-native-paper';

export default function SkeletonDashboard() {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3B82F6" style={styles.spinner} />
      <Text style={styles.text}>Loading dashboard insights...</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  spinner: {
    marginBottom: 16,
  },
  text: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
});
