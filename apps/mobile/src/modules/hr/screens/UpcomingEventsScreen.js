import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import HRWorkspaceScreen from './HRWorkspaceScreen';
import { useUpcomingEvents } from '../hooks/useUpcomingEvents';
import UpcomingEventCard from '../components/UpcomingEventCard';

export default function UpcomingEventsScreen() {
  const { events } = useUpcomingEvents();

  return (
    <HRWorkspaceScreen title="Upcoming Events & Milestones">
      <View style={styles.container}>
        <Text style={styles.subtitle}>Scheduled interviews, upcoming birthdays, and employment anniversaries for the team.</Text>
        <FlatList
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
          data={events}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <UpcomingEventCard event={item} />}
          ListEmptyComponent={<Text style={styles.emptyText}>No events scheduled this week.</Text>}
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
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
});
