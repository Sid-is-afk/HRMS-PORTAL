import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import { RoleEditor } from '../components/RoleEditor';
import { PermissionTree } from '../components/PermissionTree';

export default function CreateRoleScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { cloneId } = route.params || {};

  const { createRole, getRoleById, isLoading: rolesLoading } = useRoles();
  const { permissionGroups } = usePermissions();

  const [selectedPermissions, setSelectedPermissions] = useState([]);
  const [cloneValues, setCloneValues] = useState(null);

  // If cloning a role, load its values and mapped permissions
  useEffect(() => {
    if (cloneId) {
      const original = getRoleById(cloneId);
      if (original) {
        setCloneValues({
          name: `Copy of ${original.name}`,
          code: `${original.code}_COPY`,
          description: original.description,
          parentRoleId: original.parentRoleId,
          status: 'ACTIVE',
        });
        setSelectedPermissions(original.permissions || []);
      }
    }
  }, [cloneId, getRoleById]);

  const handleCreate = async (formData) => {
    try {
      await createRole({
        ...formData,
        permissions: selectedPermissions,
      });
      Alert.alert('Success', 'Role created successfully!', [
        { text: 'OK', onPress: () => navigation.navigate('RoleDirectory') }
      ]);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create role.');
    }
  };

  const handleCancel = () => {
    navigation.navigate('RoleDirectory');
  };

  return (
    <AdminLayout title="Create Custom Role">
      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.flexLayout}>
          {/* Form details */}
          <View style={styles.formCol}>
            <RoleEditor
              initialValues={cloneValues}
              isEdit={false}
              onSubmit={handleCreate}
              onCancel={handleCancel}
              isLoading={rolesLoading}
            />
          </View>

          {/* Scope selection tree */}
          <View style={styles.treeCol}>
            <Text style={styles.treeTitle}>Map Access Scopes</Text>
            <Text style={styles.treeSubtitle}>
              Select the capabilities this role should grant. Inherited policies apply.
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
});
