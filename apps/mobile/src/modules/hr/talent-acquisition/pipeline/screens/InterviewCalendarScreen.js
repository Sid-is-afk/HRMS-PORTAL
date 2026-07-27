import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useInterviewDashboard } from '../hooks/useInterviewDashboard';
import InterviewCard from '../components/InterviewCard';

export default function InterviewCalendarScreen() {
  const navigation = useNavigation();
  const { dashboard } = useInterviewDashboard();

  // Group interviews by date
  const groupedInterviews = {};
  if (dashboard?.upcomingInterviews) {
    dashboard.upcomingInterviews.forEach((int) => {
      if (!groupedInterviews[int.date]) {
        groupedInterviews[int.date] = [];
      }
      groupedInterviews[int.date].push(int);
    });
  }

  const sections = Object.keys(groupedInterviews).sort().map((date) => ({
    date,
    data: groupedInterviews[date],
  }));

  const handleSelectInterview = (intId, candId) => {
    navigation.navigate('InterviewDetails', { interviewId: intId, candidateId: candId });
  };

  return (
    <HRWorkspaceScreen title="Interview Calendar">
      <View style={styles.container}>
        {sections.length === 0 ? (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>No interviews scheduled in the near calendar.</Text>
          </View>
        ) : (
          <FlatList\n        initialNumToRender={10}\n        maxToRenderPerBatch={10}\n        windowSize={5}
            data={sections}
            keyExtractor={(item) => item.date}
            renderItem={({ item }) => {
              const formattedDate = new Date(item.date).toLocaleDateString(undefined, {
                weekday: 'long',
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              return (
                <View style={styles.sectionContainer}>
                  <Text style={styles.dateHeader}>{formattedDate}</Text>
                  {item.data.map((int) => (
                    <InterviewCard
                      key={int.id}
                      interview={int}
                      onPress={() => handleSelectInterview(int.id, int.candidateId)}
                    />
                  ))}
                </View>
              );
            }}
            contentContainerStyle={styles.listContainer}
          />
        )}
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  listContainer: {
    padding: 16,
  },
  sectionContainer: {
    marginBottom: 20,
  },
  dateHeader: {
    fontSize: 13,
    fontWeight: '800',
    color: '#4B5563',
    textTransform: 'uppercase',
    marginBottom: 10,
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
