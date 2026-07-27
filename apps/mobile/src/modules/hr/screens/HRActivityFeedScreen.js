import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import HRWorkspaceScreen from './HRWorkspaceScreen';
import { useRecentActivities } from '../hooks/useRecentActivities';
import HRActivityCard from '../components/HRActivityCard';

export default function HRActivityFeedScreen() {
  const { activities } = useRecentActivities();

  return (
    <HRWorkspaceScreen title="HR Activity Feed">
      <View style={styles.container}>
        <Text style={styles.subtitle}>Recent logs of all talent, recruitment, and onboarding events across the organization.</Text>
        <FlatList
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
          data={activities}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <HRActivityCard activity={item} />}
          contentContainerStyle={styles.list}
          ListEmptyComponent={<Text style={styles.emptyText}>No activities logged yet.</Text>}
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
