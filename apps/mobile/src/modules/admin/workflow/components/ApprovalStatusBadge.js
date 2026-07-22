import React from 'react';
import { Chip } from 'react-native-paper';
import { StyleSheet } from 'react-native';

export default function ApprovalStatusBadge({ status, style }) {
  const getColors = () => {
    switch (status) {
      case 'APPROVED':
        return { bg: '#E6F4EA', color: '#137333' };
      case 'REJECTED':
        return { bg: '#FCE8E6', color: '#C5221F' };
      case 'RETURNED':
        return { bg: '#FEF7E0', color: '#B06000' };
      case 'CANCELLED':
        return { bg: '#F1F3F4', color: '#5F6368' };
      case 'PENDING':
      default:
        return { bg: '#EFF6FF', color: '#2563EB' };
    }
  };

  const { bg, color } = getColors();

  return (
    <Chip style={[styles.badge, { backgroundColor: bg }, style]} textStyle={[styles.text, { color }]}>
      {status}
    </Chip>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignSelf: 'flex-start',
    borderRadius: 6,
    height: 24,
  },
  text: {
    fontSize: 10,
    fontWeight: 'bold',
  },
});
