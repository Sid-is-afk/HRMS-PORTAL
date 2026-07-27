import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, TextInput } from 'react-native-paper';
import HRWorkspaceScreen from './HRWorkspaceScreen';
import { usePendingTasks } from '../hooks/usePendingTasks';
import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import { useRecentActivities } from '../hooks/useRecentActivities';
import PendingTaskCard from '../components/PendingTaskCard';
import UpcomingEventCard from '../components/UpcomingEventCard';
import HRActivityCard from '../components/HRActivityCard';

export default function HRSearchScreen() {
  const [query, setQuery] = useState('');
  const { tasks } = usePendingTasks();
  const { events } = useUpcomingEvents();
  const { activities } = useRecentActivities();

  // Perform search across domains
  const filteredTasks = query
    ? tasks.filter(t => t.title.toLowerCase().includes(query.toLowerCase()) || t.description.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredEvents = query
    ? events.filter(e => e.title.toLowerCase().includes(query.toLowerCase()) || e.description.toLowerCase().includes(query.toLowerCase()))
    : [];
  const filteredActivities = query
    ? activities.filter(a => a.description.toLowerCase().includes(query.toLowerCase()))
    : [];

  const totalResults = filteredTasks.length + filteredEvents.length + filteredActivities.length;

  return (
    <HRWorkspaceScreen title="HR Global Search">
      <View style={styles.container}>
        <TextInput
          mode="outlined"
          label="Search tasks, events, and activities..."
          value={query}
          onChangeText={setQuery}
          left={<TextInput.Icon icon="magnify" />}
          activeOutlineColor="#2563EB"
          style={styles.searchInput}
        />

        {query ? (
          <View style={styles.resultsContainer}>
            <Text style={styles.resultsHeader}>
              Found {totalResults} match{totalResults !== 1 ? 'es' : ''} for "{query}"
            </Text>

            {filteredTasks.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Pending Tasks ({filteredTasks.length})</Text>
                {filteredTasks.map(t => <PendingTaskCard key={t.id} task={t} />)}
              </View>
            )}

            {filteredEvents.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Events & Milestones ({filteredEvents.length})</Text>
                {filteredEvents.map(e => <UpcomingEventCard key={e.id} event={e} />)}
              </View>
            )}

            {filteredActivities.length > 0 && (
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Activities logged ({filteredActivities.length})</Text>
                {filteredActivities.map(a => <HRActivityCard key={a.id} activity={a} />)}
              </View>
            )}

            {totalResults === 0 && (
              <Text style={styles.emptyText}>No results match your criteria.</Text>
            )}
          </View>
        ) : (
          <Text style={styles.promptText}>Type a search query to search across the HR database.</Text>
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
  resultsContainer: {
    marginTop: 8,
  },
  resultsHeader: {
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
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    marginTop: 24,
  },
  promptText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 40,
  },
});
