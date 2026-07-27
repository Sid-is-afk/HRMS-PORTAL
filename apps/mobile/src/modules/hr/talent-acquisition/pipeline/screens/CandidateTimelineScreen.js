import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Text } from 'react-native-paper';
import { useRoute } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useCandidate } from '../hooks/useCandidate';
import InterviewTimeline from '../components/InterviewTimeline';

export default function CandidateTimelineScreen() {
  const route = useRoute();
  const { candidateId } = route.params || {};

  const { candidate, isLoading } = useCandidate(candidateId);

  if (isLoading && !candidate) {
    return (
      <HRWorkspaceScreen title="Candidate Timeline">
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading timeline feed...</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  return (
    <HRWorkspaceScreen title="Application Journey Timeline">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
          <Text style={styles.candidateName}>{candidate?.firstName} {candidate?.lastName}</Text>
          <Text style={styles.jobTitle}>{candidate?.currentJobTitle}</Text>
        </View>

        <View style={styles.timelineCard}>
          <InterviewTimeline timeline={candidate?.timeline || []} />
        </View>
      </ScrollView>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  header: {
    marginBottom: 20,
    paddingHorizontal: 4,
  },
  candidateName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  jobTitle: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 2,
  },
  timelineCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 32,
  },
});
