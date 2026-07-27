import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useHiringActivities } from '../hooks/useHiringActivities';
import HiringActivityCard from '../components/HiringActivityCard';

export default function RecruitmentActivityFeedScreen() {
  const { activities } = useHiringActivities();

  return (
    <HRWorkspaceScreen title="Recruitment Audit Logs">
      <View style={styles.container}>
        <Text style={styles.subtitle}>Audit history of requisition workflow changes, job postings state updates, and reviews logs.</Text>
        
        <FlatList
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HiringActivityCard activity={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No logs recorded.</Text>}
        />
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  list: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
