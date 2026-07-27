import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const getStatusStyle = (status) => {
  switch (status) {
    case 'APPROVED':
    case 'PUBLISHED':
      return { text: '#16A34A', bg: '#DCFCE7', label: 'Active / Published' };
    case 'PENDING':
    case 'PAUSED':
      return { text: '#D97706', bg: '#FEF3C7', label: status };
    case 'REJECTED':
    case 'CLOSED':
      return { text: '#DC2626', bg: '#FEF2F2', label: status };
    case 'DRAFT':
      return { text: '#4B5563', bg: '#F3F4F6', label: 'Draft' };
    default:
      return { text: '#6B7280', bg: '#F9FAFB', label: status };
  }
};

export default function JobStatusBadge({ status }) {
  const style = getStatusStyle(status);
  return (
    <View style={[styles.badge, { backgroundColor: style.bg }]}>
      <Text style={[styles.text, { color: style.text }]}>{style.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});
