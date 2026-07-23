import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useRoles } from '../hooks/useRoles';
import { usePermissions } from '../hooks/usePermissions';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { UserRoleBadge } from '../components/UserRoleBadge';
import { Button } from '@/shared/components/Button';
import { Shield, ChevronLeft, Calendar } from 'lucide-react-native';

export default function RoleDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const { getRoleById, allRoles } = useRoles();
  const { permissions } = usePermissions();

  const role = getRoleById(id);

  if (!role) {
    return (
      <AdminLayout title="Role Details">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Role not found.</Text>
          <Button title="Back to Directory" onPress={() => navigation.navigate('RoleDirectory')} />
        </View>
      </AdminLayout>
    );
  }

  // Find parent role name
  const parentRole = role.parentRoleId ? allRoles.find(r => r.id === role.parentRoleId) : null;

  // Map role permissions to full definitions
  const rolePermissions = role.permissions.map(code => {
    return permissions.find(p => p.code === code) || { code, name: code, description: 'No description.' };
  });

  return (
    <AdminLayout title={`Role: ${role.name}`}>
      <ScrollView contentContainerStyle={styles.container}>
        {/* Header Navigation */}
        <TouchableOpacity 
          style={styles.backLink}
          onPress={() => navigation.navigate('RoleDirectory')}
        >
          <ChevronLeft size={16} color="#2563EB" />
          <Text style={styles.backLinkText}>Back to Directory</Text>
        </TouchableOpacity>

        {/* Hero Card */}
        <View style={styles.heroCard}>
          <View style={styles.heroHeader}>
            <View>
              <Text style={styles.heroName}>{role.name}</Text>
              <Text style={styles.heroCode}>{role.code}</Text>
            </View>
            <View style={styles.badgeRow}>
              <StatusBadge status={role.status} />
              <UserRoleBadge roleCode={role.code} roleName={role.isCustom ? 'Custom Role' : 'System Role'} />
            </View>
          </View>

          <Text style={styles.heroDesc}>{role.description || 'No description provided.'}</Text>

          <View style={styles.metadataGrid}>
            <View style={styles.metaItem}>
              <Calendar size={14} color="#6B7280" />
              <Text style={styles.metaLabel}>Created: </Text>
              <Text style={styles.metaValue}>{new Date(role.createdAt).toLocaleDateString()}</Text>
            </View>
            
            {parentRole && (
              <View style={styles.metaItem}>
                <Shield size={14} color="#6B7280" />
                <Text style={styles.metaLabel}>Inherits From: </Text>
                <Text style={styles.metaValue}>{parentRole.name}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Permissions list */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            Assigned Capabilities ({role.permissions.length})
          </Text>
          <Text style={styles.sectionDesc}>
            These specific permissions represent the absolute functional boundary allowed by this role.
          </Text>

          {rolePermissions.length === 0 ? (
            <View style={styles.emptyPermissions}>
              <Text style={styles.emptyPermissionsText}>No permissions mapped to this role.</Text>
            </View>
          ) : (
            <View style={styles.permissionList}>
              {rolePermissions.map((perm) => (
                <View key={perm.code} style={styles.permRow}>
                  <View style={styles.permHeader}>
                    <Text style={styles.permName}>{perm.name}</Text>
                    <Text style={styles.permCode}>{perm.code}</Text>
                  </View>
                  <Text style={styles.permDesc}>{perm.description}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Action Controls */}
        <View style={styles.actions}>
          <Button
            title="Edit Scope"
            variant="outline"
            onPress={() => navigation.navigate('EditRole', { id: role.id })}
            style={styles.actionBtn}
          />
          <Button
            title="Clone Role"
            variant="outline"
            onPress={() => navigation.navigate('CreateRole', { cloneId: role.id })}
            style={styles.actionBtn}
          />
        </View>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
  },
  backLink: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 4,
  },
  backLinkText: {
    fontSize: 14,
    color: '#2563EB',
    fontWeight: '600',
  },
  heroCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'start',
    marginBottom: 12,
    flexWrap: 'wrap',
    gap: 12,
  },
  heroName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  heroCode: {
    fontSize: 12,
    fontFamily: 'monospace',
    color: '#4B5563',
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
  },
  heroDesc: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  metadataGrid: {
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    gap: 8,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaLabel: {
    fontSize: 12,
    color: '#6B7280',
    fontWeight: '600',
  },
  metaValue: {
    fontSize: 12,
    color: '#111827',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  sectionDesc: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 16,
  },
  emptyPermissions: {
    padding: 24,
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  emptyPermissionsText: {
    color: '#6B7280',
    fontSize: 13,
  },
  permissionList: {
    gap: 12,
  },
  permRow: {
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  permHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  permName: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
  },
  permCode: {
    fontSize: 9,
    fontFamily: 'monospace',
    color: '#2563EB',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 4,
    paddingVertical: 1,
    borderRadius: 3,
  },
  permDesc: {
    fontSize: 12,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actionBtn: {
    minWidth: 120,
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
