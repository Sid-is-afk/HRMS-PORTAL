import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { FAB, Searchbar, SegmentedButtons } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useRoles } from '../hooks/useRoles';
import { RoleCard } from '../components/RoleCard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';

export default function RoleDirectoryScreen() {
  const navigation = useNavigation();
  const {
    roles,
    isLoading,
    error,
    filters,
    setFilters,
    archiveRole,
  } = useRoles();

  const [searchVal, setSearchVal] = useState('');

  const handleSearch = (val) => {
    setSearchVal(val);
    setFilters({ roleSearch: val });
  };

  const handleStatusChange = (status) => {
    setFilters({ roleStatus: status });
  };

  const handleSelectRole = (id) => {
    navigation.navigate('RoleDetails', { id });
  };

  const handleEditRole = (id) => {
    navigation.navigate('EditRole', { id });
  };

  const handleCloneRole = (id) => {
    navigation.navigate('CreateRole', { cloneId: id });
  };

  const handleArchiveRole = (id) => {
    Alert.alert(
      'Archive Role',
      'Are you sure you want to archive this role? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Archive', 
          style: 'destructive',
          onPress: async () => {
            try {
              await archiveRole(id);
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to archive role.');
            }
          }
        }
      ]
    );
  };

  return (
    <AdminLayout title="Role Directory">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <View style={styles.searchBarContainer}>
          <Searchbar
            placeholder="Search roles by name or code..."
            onChangeText={handleSearch}
            value={searchVal}
            style={styles.searchBar}
          />
        </View>

        <View style={styles.filterContainer}>
          <SegmentedButtons
            value={filters.roleStatus || 'all'}
            onValueChange={handleStatusChange}
            buttons={[
              { value: 'all', label: 'All Roles' },
              { value: 'ACTIVE', label: 'Active' },
              { value: 'INACTIVE', label: 'Inactive' },
              { value: 'ARCHIVED', label: 'Archived' },
            ]}
            style={styles.segmented}
          />
        </View>

        {isLoading && roles.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {roles.map((role) => (
              <RoleCard
                key={role.id}
                role={role}
                onPress={handleSelectRole}
                onEdit={handleEditRole}
                onClone={handleCloneRole}
                onArchive={handleArchiveRole}
              />
            ))}
          </ScrollView>
        )}

        <FAB
          icon="plus"
          label="Create Custom Role"
          style={styles.fab}
          color="#FFFFFF"
          onPress={() => navigation.navigate('CreateRole')}
        />
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
    paddingBottom: 8,
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  filterContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  segmented: {
    backgroundColor: '#FFFFFF',
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2563EB',
  },
});
