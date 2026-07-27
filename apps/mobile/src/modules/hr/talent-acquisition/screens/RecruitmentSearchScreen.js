import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useJobRequisitions } from '../hooks/useJobRequisitions';
import { useJobPostings } from '../hooks/useJobPostings';
import { useHiringActivities } from '../hooks/useHiringActivities';
import JobRequisitionCard from '../components/JobRequisitionCard';
import JobPostingCard from '../components/JobPostingCard';
import HiringActivityCard from '../components/HiringActivityCard';
import { searchSchema } from '../validation/talentSchema';

export default function RecruitmentSearchScreen() {
  const [query, setQuery] = useState('');
  const { jobRequisitions } = useJobRequisitions();
  const { jobPostings } = useJobPostings();
  const { activities } = useHiringActivities();
  const [error, setError] = useState('');

  const handleQueryChange = (txt) => {
    setQuery(txt);
    setError('');
    if (txt) {
      const validation = searchSchema.safeParse(txt);
      if (!validation.success) {
        setError(validation.error.errors[0]?.message || 'Invalid search query');
      }
    }
  };

  const filteredReqs = query
    ? jobRequisitions.filter(r => r.title.toLowerCase().includes(query.toLowerCase()) || r.departmentName.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredPosts = query
    ? jobPostings.filter(p => p.title.toLowerCase().includes(query.toLowerCase()) || p.description.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredActivities = query
    ? activities.filter(a => a.description.toLowerCase().includes(query.toLowerCase()))
    : [];

  const total = filteredReqs.length + filteredPosts.length + filteredActivities.length;

  return (
    <HRWorkspaceScreen title="Recruitment Search">
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Search job requests, opportunities, and logs..."
          value={query}
          onChangeText={handleQueryChange}
          left={<TextInput.Icon icon="magnify" />}
          activeOutlineColor="#2563EB"
          style={styles.searchInput}
          error={!!error}
        />
        {error ? <Text style={styles.errorText}>{error}</Text> : null}

        {query && !error ? (
          <View style={styles.results}>
            <Text style={styles.headerText}>Found {total} result{total !== 1 ? 's' : ''} for "{query}"</Text>
            
            {filteredReqs.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Requisitions ({filteredReqs.length})</Text>
                {filteredReqs.map(r => <JobRequisitionCard key={r.id} requisition={r} />)}
              </View>
            )}

            {filteredPosts.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Job Postings ({filteredPosts.length})</Text>
                {filteredPosts.map(p => <JobPostingCard key={p.id} posting={p} />)}
              </View>
            )}

            {filteredActivities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Hiring Logs ({filteredActivities.length})</Text>
                {filteredActivities.map(a => <HiringActivityCard key={a.id} activity={a} />)}
              </View>
            )}
          </View>
        ) : (
          <Text style={styles.prompt}>Type a query to search across the hiring workspace database.</Text>
        )}
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  searchInput: {
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  results: {
    marginTop: 8,
  },
  headerText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#6B7280',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  prompt: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
  errorText: {
    fontSize: 11,
    color: '#DC2626',
    marginTop: -10,
    marginBottom: 10,
  },
});
