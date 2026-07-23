import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { Searchbar } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { useRoles } from '../hooks/useRoles';
import { useRoleAssignments } from '../hooks/useRoleAssignments';
import { RoleAssignmentPanel } from '../components/RoleAssignmentPanel';
import { UserRoleBadge } from '../components/UserRoleBadge';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ShieldAlert, Trash2, ArrowLeftRight } from 'lucide-react-native';

export default function RoleAssignmentScreen() {
  const { roles } = useRoles();
  const {
    assignments,
    isLoading,
    error,
    setFilters,
    assignRole,
    removeRole,
    transferRole,
  } = useRoleAssignments();

  const [searchVal, setSearchVal] = useState('');
  const [showAssignPanel, setShowAssignPanel] = useState(false);

  // Mock list of employees that can receive roles
  const mockEmployees = [
    { id: 'emp-1', firstName: 'Sanjay', lastName: 'Kumar', email: 'sanjay.kumar@company.com' },
    { id: 'emp-2', firstName: 'Kriti', lastName: 'Sen', email: 'kriti.sen@company.com' },
    { id: 'emp-3', firstName: 'Aarav', lastName: 'Patel', email: 'aarav.patel@company.com' },
    { id: 'emp-4', firstName: 'Priya', lastName: 'Sharma', email: 'priya.sharma@company.com' },
    { id: 'emp-5', firstName: 'Vikram', lastName: 'Singh', email: 'vikram.singh@company.com' },
  ];

  const handleSearch = (val) => {
    setSearchVal(val);
    setFilters({ assignmentSearch: val });
  };

  const handleAssignRole = async (employeeId, roleId) => {
    try {
      await assignRole(employeeId, roleId);
      setShowAssignPanel(false);
      Alert.alert('Success', 'Access role assigned successfully.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Assignment failed.');
    }
  };

  const handleRevokeRole = (assignmentId, employeeName, roleName) => {
    Alert.alert(
      'Revoke Role Assignment',
      `Are you sure you want to revoke the "${roleName}" role from ${employeeName}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Revoke Access',
          style: 'destructive',
          onPress: async () => {
            try {
              await removeRole(assignmentId);
              Alert.alert('Success', 'Access revoked.');
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to revoke role.');
            }
          }
        }
      ]
    );
  };

  const handleTransferRole = (employeeId, employeeName, currentRoleId, currentRoleName) => {
    // Show role options for transfer
    const activeRoles = roles.filter(r => r.id !== currentRoleId && r.status === 'ACTIVE');
    if (activeRoles.length === 0) {
      Alert.alert('Unavailable', 'No other active roles are configured for transfer.');
      return;
    }

    const options = activeRoles.map(r => ({
      text: r.name,
      onPress: async () => {
        try {
          await transferRole(employeeId, currentRoleId, r.id);
          Alert.alert('Success', `Transferred ${employeeName} to ${r.name}.`);
        } catch (err) {
          Alert.alert('Error', err.message || 'Transfer failed.');
        }
      }
    }));

    Alert.alert(
      'Transfer Access Role',
      `Select a new role for ${employeeName} to replace "${currentRoleName}":`,
      [
        ...options.slice(0, 2), // Keep list clean
        { text: 'Cancel', style: 'cancel' }
      ]
    );
  };

  return (
    <AdminLayout title="Role Assignments">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {/* Action Toggle Button */}
        <View style={styles.topActions}>
          <Searchbar
            placeholder="Search assignments by staff name or role..."
            onChangeText={handleSearch}
            value={searchVal}
            style={styles.searchBar}
          />
          <Button
            mode="contained"
            onPress={() => setShowAssignPanel(!showAssignPanel)}
            style={styles.assignBtn}
            buttonColor="#2563EB"
          >
            {showAssignPanel ? 'Close Panel' : 'Assign Role'}
          </Button>
        </View>

        {showAssignPanel && (
          <View style={styles.panelContainer}>
            <RoleAssignmentPanel
              roles={roles}
              employees={mockEmployees}
              onSubmit={handleAssignRole}
              onCancel={() => setShowAssignPanel(false)}
              isLoading={isLoading}
            />
          </View>
        )}

        {isLoading && assignments.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            <View style={styles.tableContainer}>
              <ScrollView horizontal={true} showsHorizontalScrollIndicator={true}>
                <View style={styles.table}>
                  {/* Header Row */}
                  <View style={[styles.row, styles.headerRow]}>
                    <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Employee Name</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 220 }]}>Work Email</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 180 }]}>Assigned Role</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 120 }]}>Granted At</Text>
                    <Text style={[styles.cell, styles.headerCell, { width: 120 }]}>Actions</Text>
                  </View>

                  {/* Body Rows */}
                  {assignments.length === 0 ? (
                    <View style={styles.emptyTable}>
                      <ShieldAlert size={36} color="#9CA3AF" />
                      <Text style={styles.emptyTableText}>No active assignments matched.</Text>
                    </View>
                  ) : (
                    assignments.map((asgn) => (
                      <View key={asgn.id} style={styles.row}>
                        <Text style={[styles.cell, styles.nameCell, { width: 180 }]} numberOfLines={1}>
                          {asgn.employeeName}
                        </Text>
                        <Text style={[styles.cell, styles.emailCell, { width: 220 }]} numberOfLines={1}>
                          {asgn.employeeEmail}
                        </Text>
                        <View style={[styles.cell, { width: 180 }]}>
                          <UserRoleBadge roleCode={asgn.roleId} roleName={asgn.roleName} />
                        </View>
                        <Text style={[styles.cell, styles.dateCell, { width: 120 }]}>
                          {new Date(asgn.assignedAt).toLocaleDateString()}
                        </Text>
                        <View style={[styles.cell, styles.actionsCell, { width: 120 }]}>
                          <TouchableOpacity
                            onPress={() => handleTransferRole(asgn.employeeId, asgn.employeeName, asgn.roleId, asgn.roleName)}
                            style={styles.actionBtn}
                          >
                            <ArrowLeftRight size={14} color="#3B82F6" />
                          </TouchableOpacity>
                          
                          <TouchableOpacity
                            onPress={() => handleRevokeRole(asgn.id, asgn.employeeName, asgn.roleName)}
                            style={[styles.actionBtn, styles.revokeBtn]}
                          >
                            <Trash2 size={14} color="#DC2626" />
                          </TouchableOpacity>
                        </View>
                      </View>
                    ))
                  )}
                </View>
              </ScrollView>
            </View>
          </ScrollView>
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActions: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  assignBtn: {
    height: 48,
    justifyContent: 'center',
    borderRadius: 8,
  },
  panelContainer: {
    padding: 16,
  },
  list: {
    padding: 16,
  },
  tableContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    overflow: 'hidden',
  },
  table: {
    minWidth: 820,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  headerRow: {
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 2,
    borderBottomColor: '#E5E7EB',
  },
  cell: {
    paddingRight: 12,
  },
  headerCell: {
    fontWeight: '600',
    color: '#374151',
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  nameCell: {
    color: '#111827',
    fontWeight: '500',
    fontSize: 13,
  },
  emailCell: {
    color: '#6B7280',
    fontSize: 13,
  },
  dateCell: {
    color: '#4B5563',
    fontSize: 13,
  },
  actionsCell: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  actionBtn: {
    padding: 6,
    borderRadius: 4,
    backgroundColor: '#EFF6FF',
  },
  revokeBtn: {
    backgroundColor: '#FEF2F2',
  },
  emptyTable: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  emptyTableText: {
    marginTop: 8,
    color: '#6B7280',
    fontSize: 13,
  },
});
