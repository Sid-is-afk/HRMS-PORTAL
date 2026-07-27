import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text, Chip, Button } from 'react-native-paper';
import DepartmentSelector from './DepartmentSelector';

export default function RecruitmentFilterPanel({ filters, onFilterChange, onReset }) {
  const types = [
    { id: 'all', label: 'All Types' },
    { id: 'FULL_TIME', label: 'Full Time' },
    { id: 'PART_TIME', label: 'Part Time' },
    { id: 'CONTRACT', label: 'Contract' },
    { id: 'INTERN', label: 'Intern' },
  ];

  const priorities = [
    { id: 'all', label: 'All Priorities' },
    { id: 'LOW', label: 'Low' },
    { id: 'MEDIUM', label: 'Medium' },
    { id: 'HIGH', label: 'High' },
  ];

  const statuses = [
    { id: 'all', label: 'All Statuses' },
    { id: 'ACTIVE', label: 'Active' },
    { id: 'DEACTIVATED', label: 'Deactivated' },
    { id: 'ARCHIVED', label: 'Archived' },
  ];

  return (
    <ScrollView style={styles.container}>
      <DepartmentSelector
        selectedId={filters.departmentId}
        onSelect={(id) => onFilterChange({ departmentId: id })}
      />

      <View style={styles.section}>
        <Text style={styles.label}>Employment Type</Text>
        <View style={styles.chipRow}>
          {types.map((t) => (
            <Chip
              key={t.id}
              selected={filters.employmentType === t.id}
              onPress={() => onFilterChange({ employmentType: t.id })}
              style={styles.chip}
              selectedColor="#2563EB"
            >
              {t.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Priority Level</Text>
        <View style={styles.chipRow}>
          {priorities.map((p) => (
            <Chip
              key={p.id}
              selected={filters.priority === p.id}
              onPress={() => onFilterChange({ priority: p.id })}
              style={styles.chip}
              selectedColor="#2563EB"
            >
              {p.label}
            </Chip>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Approval Status / State</Text>
        <View style={styles.chipRow}>
          {statuses.map((s) => (
            <Chip
              key={s.id}
              selected={filters.status === s.id}
              onPress={() => onFilterChange({ status: s.id })}
              style={styles.chip}
              selectedColor="#2563EB"
            >
              {s.label}
            </Chip>
          ))}
        </View>
      </View>

      <Button mode="outlined" onPress={onReset} style={styles.resetBtn} textColor="#2563EB">
        Reset All Filters
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  section: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#FFFFFF',
    borderColor: '#E5E7EB',
    borderWidth: 1,
  },
  resetBtn: {
    marginTop: 8,
    borderColor: '#2563EB',
    borderRadius: 8,
  },
});
