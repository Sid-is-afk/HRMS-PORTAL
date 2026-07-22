import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Text, Button } from 'react-native-paper';

export default function EmployeeFilterPanel({
  filters,
  onFilterChange,
  onReset,
  departments = [],
}) {
  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'INACTIVE', label: 'Inactive' },
    { id: 'ON_LEAVE', label: 'On Leave' },
    { id: 'TERMINATED', label: 'Terminated' },
  ];

  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'FULL_TIME', label: 'Full Time' },
    { id: 'PART_TIME', label: 'Part Time' },
    { id: 'CONTRACT', label: 'Contract' },
    { id: 'INTERN', label: 'Intern' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Status</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {statuses.map((item) => (
          <Chip
            key={item.id}
            selected={filters.status === item.id}
            onPress={() => onFilterChange({ status: item.id })}
            style={styles.chip}
          >
            {item.label}
          </Chip>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Employment Type</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {types.map((item) => (
          <Chip
            key={item.id}
            selected={filters.type === item.id}
            onPress={() => onFilterChange({ type: item.id })}
            style={styles.chip}
          >
            {item.label}
          </Chip>
        ))}
      </ScrollView>

      <Text style={styles.sectionTitle}>Department</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        <Chip
          selected={filters.departmentId === 'all'}
          onPress={() => onFilterChange({ departmentId: 'all' })}
          style={styles.chip}
        >
          All Departments
        </Chip>
        {departments.map((item) => (
          <Chip
            key={item.id}
            selected={filters.departmentId === item.id}
            onPress={() => onFilterChange({ departmentId: item.id })}
            style={styles.chip}
          >
            {item.name}
          </Chip>
        ))}
      </ScrollView>

      <Button mode="outlined" onPress={onReset} style={styles.resetButton} labelStyle={styles.resetText}>
        Reset All Filters
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
    marginBottom: 6,
  },
  scroll: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  chip: {
    marginRight: 6,
    backgroundColor: '#F3F4F6',
  },
  resetButton: {
    marginTop: 12,
    borderColor: '#D1D5DB',
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
  },
});
