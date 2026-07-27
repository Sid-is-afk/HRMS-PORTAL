import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { organizationService } from '@/modules/admin/organization/services/organizationService';

export default function DepartmentSelector({ selectedId, onSelect, departments: propDepartments }) {
  const [departments, setDepartments] = useState(propDepartments || []);

  useEffect(() => {
    if (!propDepartments) {
      async function load() {
        try {
          const data = await organizationService.getDepartments();
          setDepartments(data);
        } catch {
          // Fallback to basic list if service fails
          setDepartments([
            { id: 'dept-eng', name: 'Engineering' },
            { id: 'dept-hr', name: 'Human Resources' },
            { id: 'dept-prod', name: 'Product' },
            { id: 'dept-mktg', name: 'Marketing' },
          ]);
        }
      }
      load();
    }
  }, [propDepartments]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Department</Text>
      <View style={styles.chipRow}>
        {departments.map((d) => (
          <Chip 
            key={d.id} 
            selected={selectedId === d.id} 
            onPress={() => onSelect(d.id)} 
            style={styles.chip}
            selectedColor="#2563EB"
          >
            {d.name}
          </Chip>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
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
});
