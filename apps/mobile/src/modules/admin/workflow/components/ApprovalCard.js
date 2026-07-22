import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import ApprovalStatusBadge from './ApprovalStatusBadge';

export default function ApprovalCard({ request, onPress }) {
  const { requesterName, module, details, status, createdAt } = request;

  const formatDate = (isoStr) => {
    try {
      return new Date(isoStr).toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      });
    } catch {
      return '';
    }
  };

  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.header}>
          <Text style={styles.requester}>{requesterName}</Text>
          <ApprovalStatusBadge status={status} />
        </View>
        <Text style={styles.module}>{module} Approval Request</Text>
        <Text style={styles.details} numberOfLines={2}>{details}</Text>
        <Text style={styles.date}>Submitted on {formatDate(createdAt)}</Text>
      </TouchableOpacity>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 10,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  requester: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  module: {
    fontSize: 12,
    color: '#3B82F6',
    fontWeight: '600',
    marginBottom: 6,
  },
  details: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  date: {
    fontSize: 10,
    color: '#9CA3AF',
  },
});
