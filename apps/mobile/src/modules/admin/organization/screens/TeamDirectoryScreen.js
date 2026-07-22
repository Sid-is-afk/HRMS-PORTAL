import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useTeams } from '../hooks/useTeams';
import TeamCard from '../components/TeamCard';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function TeamDirectoryScreen() {
  const { teams, isLoading, error } = useTeams();

  return (
    <AdminLayout title="Operational Teams">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && teams.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <FlatList
            data={teams}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => <TeamCard team={item} />}
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
