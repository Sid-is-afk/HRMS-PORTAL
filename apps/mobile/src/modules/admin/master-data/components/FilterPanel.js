import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export function FilterPanel({ currentStatus, onStatusSelect }) {
  const statuses = [
    { value: 'all', label: 'All Statuses' },
    { value: 'ACTIVE', label: 'Active' },
    { value: 'INACTIVE', label: 'Inactive' },
    { value: 'ARCHIVED', label: 'Archived' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Filter by Status:</Text>
      <View style={styles.buttons}>
        {statuses.map((s) => {
          const isSelected = currentStatus === s.value;
          return (
            <TouchableOpacity
              key={s.value}
              onPress={() => onStatusSelect(s.value)}
              style={[styles.badge, isSelected && styles.activeBadge]}
            >
              <Text style={[styles.badgeText, isSelected && styles.activeBadgeText]}>
                {s.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  buttons: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  badge: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 16,
  },
  activeBadge: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  badgeText: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },
  activeBadgeText: {
    color: '#4F46E5',
    fontWeight: '700',
  },
});
