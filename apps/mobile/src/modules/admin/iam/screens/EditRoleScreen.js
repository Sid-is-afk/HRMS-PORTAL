import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import { RoleEditor } from '../components/RoleEditor';
import { PermissionTree } from '../components/PermissionTree';

export default function EditRoleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { updateRole, getRoleById, isLoading: rolesLoading } = useRoles();
  const { permissionGroups } = usePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [roleValues, setRoleValues] = useState(null);

  const role = getRoleById(id);

  useEffect(() => {
    if (role) {
      setRoleValues(role);
      setSelectedPermissions(role.permissions || []);
    }
  }, [role]);

  if (!role) {
    return (
      <AdminLayout title="Edit Role Scope">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Role not found.</Text>
          <Button title="Back to Directory" onPress={() => navigation.navigate('RoleDirectory')} />
        </View>
      </AdminLayout>
    );
  }

  const handleUpdate = async (formData) => {
    try {
      await updateRole(id, {
        ...formData,
        permissions: selectedPermissions,
      });
      Alert.alert('Success', 'Role scope updated successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('RoleDirectory') }
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update role scope.');
    }
  };

  const handleCancel = () => {
    navigation.navigate('RoleDirectory');
  };

  return (
    <AdminLayout title={`Edit Role: ${role.name}`}>
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.flexLayout}>
          {/* Form details */}
          <View style={styles.formCol}>
            <RoleEditor
              initialValues={roleValues}
              isEdit={true}
              onSubmit={handleUpdate}
              onCancel={handleCancel}
              isLoading={rolesLoading}
            />
          </View>

          {/* Scope selection tree */}
          <View style={styles.treeCol}>
            <Text style={styles.treeTitle}>Adjust Access Scopes</Text>
            <Text style={styles.treeSubtitle}>
              Toggle capabilities below. Changes will apply dynamically to all assigned employees.
            </Text>
            
            <PermissionTree
              groups={permissionGroups}
              selectedPermissions={selectedPermissions}
              onChange={setSelectedPermissions}
            />
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  flexLayout: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 24,
    alignItems: 'start',
  },
  formCol: {
    flex: 1,
    minWidth: 320,
  },
  treeCol: {
    flex: 1,
    minWidth: 320,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  treeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  treeSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 16,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  errorText: {
    fontSize: 16,
    color: '#DC2626',
    fontWeight: '600',
  },
});
