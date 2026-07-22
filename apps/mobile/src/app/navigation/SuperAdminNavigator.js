import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function SuperAdminNavigator() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Super Admin Dashboard Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  text: {
    fontSize: 18,
    fontWeight: '600',
    color: '#4B5563',
  },
});
