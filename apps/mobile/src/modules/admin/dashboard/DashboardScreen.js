import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import AdminLayout from '../components/AdminLayout';

export default function DashboardScreen() {
  return (
    <AdminLayout title="Admin Dashboard">
      <View style={styles.content}>
        <Text style={styles.placeholderText}>Admin dashboard placeholder.</Text>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  content: {
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeholderText: {
    fontSize: 16,
    color: '#6B7280',
  },
});
