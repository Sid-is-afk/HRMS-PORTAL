import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';

export default function WorkflowConfigurationScreen() {
  return (
    <AdminLayout title="Workflow Configuration">
      <View style={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>Workflow Routing Configuration Engine</Text>
            <Text style={styles.subtitle}>
              This is a placeholder for configuring generic workflow stages, escalation paths, and approver mapping rules.
            </Text>
          </Card.Content>
        </Card>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    padding: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 13,
    color: '#6B7280',
    lineHeight: 18,
  },
});
