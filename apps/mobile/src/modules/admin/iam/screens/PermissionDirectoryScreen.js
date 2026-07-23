import React, { useState, useMemo } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Searchbar } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { usePermissions } from '../hooks/usePermissions';
import { PermissionTable } from '../components/PermissionTable';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';

export default function PermissionDirectoryScreen() {
  const { permissions, isLoading, error } = usePermissions();
  const [searchVal, setSearchVal] = useState('');

  const filteredPermissions = useMemo(() => {
    if (!searchVal) return permissions;
    const q = searchVal.toLowerCase();
    return permissions.filter(p =>
      p.code.toLowerCase().includes(q) ||
      p.name.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q)
    );
  }, [permissions, searchVal]);

  return (
    <AdminLayout title="System Permissions">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <View style={styles.searchBarContainer}>
          <Searchbar
            placeholder="Search permissions by identifier, category, or scope description..."
            onChangeText={setSearchVal}
            value={searchVal}
            style={styles.searchBar}
          />
        </View>

        {isLoading && permissions.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            <PermissionTable permissions={filteredPermissions} />
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
  searchBarContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 16,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  list: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
});
