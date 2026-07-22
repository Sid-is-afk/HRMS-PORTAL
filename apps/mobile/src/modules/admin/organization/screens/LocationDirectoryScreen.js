import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useLocations } from '../hooks/useLocations';
import LocationCard from '../components/LocationCard';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function LocationDirectoryScreen() {
  const { locations, isLoading, error } = useLocations();

  return (
    <AdminLayout title="Office Locations">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && locations.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <FlatList
            data={locations}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <LocationCard location={item} />}
            contentContainerStyle={styles.list}
          />
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
  list: {
    paddingBottom: 24,
  },
});
