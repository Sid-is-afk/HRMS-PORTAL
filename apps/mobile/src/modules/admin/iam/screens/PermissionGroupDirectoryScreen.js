import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionCategory } from '../components/PermissionCategory';
import { PermissionBadge } from '../components/PermissionBadge';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';

export default function PermissionGroupDirectoryScreen() {
  const { permissionGroups, isLoading, error } = usePermissions();

  return (
    <AdminLayout title="Permission Groups">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && permissionGroups.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            <Text style={styles.intro}>
              Below are the logical groupings of access permissions configured in the Enterprise HRMS engine.
            </Text>

            {permissionGroups.map((group) => (
              <View key={group.id} style={styles.card}>
                <PermissionCategory
                  title={group.name}
                  description={group.description}
                  count={group.permissions.length}
                />
                
                <View style={styles.badges}>
                  {group.permissions.map((perm) => (
                    <View key={perm.code} style={styles.badgeWrapper}>
                      <PermissionBadge permissionCode={perm.code} />
                      <Text style={styles.badgeDesc}>{perm.description}</Text>
                    </View>
                  ))}
                </View>
              </View>
            ))}
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
  intro: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    lineHeight: 18,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 16,
  },
  badges: {
    marginTop: 12,
    gap: 8,
  },
  badgeWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 12,
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  badgeDesc: {
    fontSize: 12,
    color: '#4B5563',
    flex: 1,
    minWidth: 200,
  },
});
