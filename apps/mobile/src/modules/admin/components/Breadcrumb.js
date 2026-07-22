import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function Breadcrumb({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.link}>Admin</Text>
      <Text style={styles.separator}>/</Text>
      <Text style={styles.current}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  link: {
    fontSize: 12,
    color: '#4B5563',
  },
  separator: {
    fontSize: 12,
    color: '#9CA3AF',
    marginHorizontal: 8,
  },
  current: {
    fontSize: 12,
    color: '#1F2937',
    fontWeight: '500',
  },
});
