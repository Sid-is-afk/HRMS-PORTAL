import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Chip, Text } from 'react-native-paper';
import { employeeService } from '@/modules/admin/employee-management/services/employeeService';

export default function HiringManagerSelector({ selectedId, onSelect, managers: propManagers }) {
  const [managers, setManagers] = useState(propManagers || []);

  useEffect(() => {
    if (!propManagers) {
      async function load() {
        try {
          const data = await employeeService.getEmployees({ role: 'MANAGER' });
          setManagers(data);
        } catch {
          // Fallback to basic list if service fails
          setManagers([
            { id: 'emp-mgr1', firstName: 'Sanjay', lastName: 'Kumar' },
            { id: 'emp-mgr2', firstName: 'Kriti', lastName: 'Sen' },
          ]);
        }
      }
      load();
    }
  }, [propManagers]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Hiring Manager</Text>
      <View style={styles.chipRow}>
        {managers.map((m) => (
          <Chip 
            key={m.id} 
            selected={selectedId === m.id} 
            onPress={() => onSelect(m.id)} 
            style={styles.chip}
            selectedColor="#2563EB"
          >
            {m.firstName} {m.lastName}
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
