import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Menu } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { useRoleAssignments } from '../hooks/useRoleAssignments';
import { EffectivePermissionViewer } from '../components/EffectivePermissionViewer';
import { Button } from '@/shared/components/Button';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';

export default function UserPermissionViewerScreen() {
  const {
    effectivePermissions,
    isLoading,
    error,
    selectedEmployeeId,
    setSelectedEmployeeId,
  } = useRoleAssignments();

  const [menuVisible, setMenuVisible] = useState(false);

  // List of employee choices
  const mockEmployees = [
    { id: 'emp-1', firstName: 'Sanjay', lastName: 'Kumar', email: 'sanjay.kumar@company.com' },
    { id: 'emp-2', firstName: 'Kriti', lastName: 'Sen', email: 'kriti.sen@company.com' },
    { id: 'emp-3', firstName: 'Aarav', lastName: 'Patel', email: 'aarav.patel@company.com' },
    { id: 'emp-4', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@company.com' },
    { id: 'emp-5', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@company.com' },
  ];

  const selectedEmployee = mockEmployees.find(e => e.id === selectedEmployeeId);

  return (
    <AdminLayout title="User Scope Analyzer">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {/* Top selector bar */}
        <View style={styles.selectorBar}>
          <Text style={styles.selectorLabel}>Choose Employee: </Text>
          <Menu
            visible={menuVisible}
            onDismiss={() => setMenuVisible(false)}
            anchor={
              <Button
                title={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.email})` : 'Choose Employee...'}
                variant="outline"
                onPress={() => setMenuVisible(true)}
                style={styles.pickerBtn}
              />
            }
          >
            {mockEmployees.map((emp) => (
              <Menu.Item
                key={emp.id}
                onPress={() => {
                  setSelectedEmployeeId(emp.id);
                  setMenuVisible(false);
                }}
                title={`${emp.firstName} ${emp.lastName}`}
              />
            ))}
          </Menu>
        </View>

        {/* Detailed list display */}
        {isLoading ? (
          <SkeletonDashboard />
        ) : (
          <View style={styles.viewerContainer}>
            <EffectivePermissionViewer
              effectivePermissions={effectivePermissions}
              employeeName={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}` : ''}
            />
          </View>
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  selectorBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    gap: 12,
  },
  selectorLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  pickerBtn: {
    flex: 1,
    alignItems: 'start',
    borderColor: '#D1D5DB',
  },
  viewerContainer: {
    flex: 1,
  },
});
