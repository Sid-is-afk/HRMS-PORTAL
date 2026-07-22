import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Avatar } from 'react-native-paper';
import ApprovalStatusBadge from './ApprovalStatusBadge';

export default function WorkflowStep({ step }) {
  const { name, sequence, status, approvers = [] } = step;

  return (
    <View style={styles.container}>
      <View style={styles.stepCircle}>
        <Text style={styles.stepNum}>{sequence}</Text>
      </View>
      <View style={styles.info}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <ApprovalStatusBadge status={status} />
        </View>
        {approvers.map((app) => (
          <View key={app.id} style={styles.approverRow}>
            <Avatar.Text size={20} label={app.firstName.charAt(0).toUpperCase()} style={styles.avatar} />
            <Text style={styles.approverName}>
              {app.firstName} {app.lastName} ({app.role || 'Approver'})
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 8,
  },
  stepCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#3B82F6',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  stepNum: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  approverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  avatar: {
    backgroundColor: '#9CA3AF',
    marginRight: 6,
  },
  approverName: {
    fontSize: 12,
    color: '#4B5563',
  },
});
