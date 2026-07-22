import React from 'react';
import { View, StyleSheet } from 'react-native';
import { ProgressBar, Text } from 'react-native-paper';

export default function WorkflowProgress({ steps = [] }) {
  if (!steps || steps.length === 0) return null;

  const total = steps.length;
  const approvedCount = steps.filter((s) => s.status === 'APPROVED').length;
  const percentage = approvedCount / total;

  return (
    <View style={styles.container}>
      <View style={styles.labels}>
        <Text style={styles.labelText}>Workflow Routing Progress</Text>
        <Text style={styles.percentText}>{Math.round(percentage * 100)}%</Text>
      </View>
      <ProgressBar progress={percentage} color="#10B981" style={styles.bar} />
      <Text style={styles.subText}>
        {approvedCount} of {total} steps approved
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 12,
  },
  labels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  labelText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
  },
  percentText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#10B981',
  },
  bar: {
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5E7EB',
  },
  subText: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 4,
  },
});
