import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

export default function StatisticCard({ label, value, color = '#3B82F6', percentage }) {
  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View style={styles.labelContainer}>
          <View style={[styles.dot, { backgroundColor: color }]} />
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={styles.valueContainer}>
          <Text style={styles.value}>{value}</Text>
          {percentage ? <Text style={styles.percentage}>({percentage})</Text> : null}
        </View>
      </View>
      <View style={styles.progressBg}>
        <View style={[styles.progressFill, { backgroundColor: color, width: percentage || '0%' }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  value: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  percentage: {
    fontSize: 11,
    color: '#9CA3AF',
    marginLeft: 4,
  },
  progressBg: {
    height: 6,
    backgroundColor: '#F3F4F6',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
  },
});
