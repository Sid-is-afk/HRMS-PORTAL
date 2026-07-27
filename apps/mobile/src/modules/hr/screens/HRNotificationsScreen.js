import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import HRWorkspaceScreen from './HRWorkspaceScreen';
import { useHRDashboardStore } from '../store/hrDashboardStore';
import HRNotificationPreview from '../components/HRNotificationPreview';

export default function HRNotificationsScreen() {
  const notifications = useHRDashboardStore((state) => state.notifications);

  return (
    <HRWorkspaceScreen title="HR Notifications & Alerts">
      <View style={styles.container}>
        <Text style={styles.subtitle}>Critical workflow notifications, compliance alerts, and policy updates requiring attention.</Text>
        <FlatList
          data={notifications}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <HRNotificationPreview 
              notification={item} 
              onPress={() => {}}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No notifications at this time.</Text>}
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
