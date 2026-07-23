import React from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { usePermissionMatrix } from '../hooks/usePermissionMatrix';
import { PermissionMatrix } from '../components/PermissionMatrix';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';

export default function PermissionMatrixScreen() {
  const {
    matrix,
    roles,
    permissions,
    isLoading,
    error,
    togglePermission,
  } = usePermissionMatrix();

  const handleToggle = async (roleId, permissionCode) => {
    try {
      await togglePermission(roleId, permissionCode);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update mapping.');
    }
  };

  return (
    <AdminLayout title="Access Matrix">
      <View style={styles.container}>
        <View style={styles.intro}>
          <Text style={styles.title}>Role-Permission Mapping Matrix</Text>
          <Text style={styles.subtitle}>
            Manage capabilities for all roles simultaneously. Click a checkbox to grant/revoke a permission scope. Super Admin roles are immutable.
          </Text>
        </View>

        {error ? <ErrorMessage message={error} /> : null}

        {isLoading ? (
          <SkeletonDashboard />
        ) : (
          <View style={styles.matrixContainer}>
            <PermissionMatrix
              roles={roles}
              permissions={permissions}
              matrix={matrix}
              onTogglePermission={handleToggle}
              disabled={isLoading}
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
  intro: {
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    lineHeight: 16,
  },
  matrixContainer: {
    flex: 1,
  },
});
