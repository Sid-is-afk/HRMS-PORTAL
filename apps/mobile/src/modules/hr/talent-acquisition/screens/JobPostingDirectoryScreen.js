import React from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { Text } from 'react-native-paper';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useJobPostings } from '../hooks/useJobPostings';
import JobPostingCard from '../components/JobPostingCard';
import RecruitmentSearchBar from '../components/RecruitmentSearchBar';
import { useRecruitmentFilters } from '../hooks/useRecruitmentFilters';

export default function JobPostingDirectoryScreen() {
  const { jobPostings, archivePosting } = useJobPostings();
  const { filters, setFilters } = useRecruitmentFilters();

  const handleArchive = (id) => {
    Alert.alert(
      'Archive Job Posting',
      'Are you sure you want to archive this job posting? It will no longer be visible on external boards.',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Archive', 
          style: 'destructive',
          onPress: async () => {
            try {
              await archivePosting(id);
              Alert.alert('Success', 'Posting successfully archived.');
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to archive posting');
            }
          }
        }
      ]
    );
  };

  return (
    <HRWorkspaceScreen title="Job Opportunities Board">
      <View style={styles.container}>
        <RecruitmentSearchBar
          value={filters.search}
          onChangeText={(txt) => setFilters({ search: txt })}
          placeholder="Search job postings..."
        />

        <FlatList
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
          data={jobPostings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobPostingCard
              posting={item}
              onArchive={handleArchive}
              onPress={() => {}}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No job postings available.</Text>}
        />
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
