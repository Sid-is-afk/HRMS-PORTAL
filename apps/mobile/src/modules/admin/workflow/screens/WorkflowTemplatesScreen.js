import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { useWorkflow } from '../hooks/useWorkflow';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function WorkflowTemplatesScreen() {
  const { templates, isLoading, error } = useWorkflow();

  return (
    <AdminLayout title="Workflow Templates">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && templates.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <FlatList
            data={templates}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <Card style={styles.card}>
                <Card.Content>
                  <View style={styles.header}>
                    <Text style={styles.name}>{item.name}</Text>
                    <Chip style={styles.typeBadge}>{item.type}</Chip>
                  </View>
                  <Text style={styles.desc}>{item.description}</Text>
                  <Text style={styles.steps}>Routing Depth: {item.totalSteps} Levels</Text>
                </Card.Content>
              </Card>
            )}
            contentContainerStyle={styles.list}
          />
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  list: {
    paddingBottom: 24,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#EFF6FF',
    height: 24,
    borderRadius: 6,
  },
  desc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 8,
  },
  steps: {
    fontSize: 11,
    color: '#9CA3AF',
    fontWeight: '600',
  },
});
