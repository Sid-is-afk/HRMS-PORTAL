import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

export default function DashboardFilterBar({ filters, onFilterChange }) {
  const ranges = [
    { id: 'today', label: 'Today' },
    { id: 'week', label: 'This Week' },
    { id: 'month', label: 'This Month' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Overview Period:</Text>
      <View style={styles.buttons}>
        {ranges.map((item) => {
          const isActive = filters.dateRange === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[styles.button, isActive && styles.activeButton]}
              onPress={() => onFilterChange({ dateRange: item.id })}
            >
              <Text style={[styles.btnText, isActive && styles.activeBtnText]}>{item.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
    width: '100%',
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
  },
  buttons: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 6,
    backgroundColor: '#F3F4F6',
  },
  activeButton: {
    backgroundColor: '#3B82F6',
  },
  btnText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  activeBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
});
