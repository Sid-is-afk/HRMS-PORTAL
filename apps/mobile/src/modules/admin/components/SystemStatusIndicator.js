import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, Text } from 'react-native-paper';

export default function SystemStatusIndicator({ status, latency }) {
  const getColors = () => {
    switch (status) {
      case 'Healthy':
        return { bg: '#E6F4EA', color: '#137333' };
      case 'Degraded':
        return { bg: '#FEF7E0', color: '#B06000' };
      case 'Down':
      default:
        return { bg: '#FCE8E6', color: '#C5221F' };
    }
  };

  const { bg, color } = getColors();

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <Text style={styles.label}>Services Status</Text>
        <Chip style={{ backgroundColor: bg }} textStyle={[styles.statusText, { color }]}>
          {status}
        </Chip>
      </View>
      {latency ? (
        <View style={styles.row}>
          <Text style={styles.label}>API Latency</Text>
          <Text style={styles.value}>{latency}ms</Text>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '500',
  },
  statusText: {
    fontSize: 12,
    fontWeight: 'bold',
  },
  value: {
    fontSize: 14,
    color: '#1F2937',
    fontWeight: 'bold',
  },
});
