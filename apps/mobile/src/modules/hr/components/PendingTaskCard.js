import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text } from 'react-native-paper';

const getPriorityColor = (priority) => {
  switch (priority) {
    case 'HIGH':
      return { text: '#DC2626', bg: '#FEF2F2' };
    case 'MEDIUM':
      return { text: '#D97706', bg: '#FFFBEB' };
    default:
      return { text: '#2563EB', bg: '#EFF6FF' };
  }
};

export default function PendingTaskCard({ task, onComplete }) {
  const priorityStyle = getPriorityColor(task.priority);
  const formattedDate = new Date(task.dueDate).toLocaleDateString([], { month: 'short', day: 'numeric' });

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.checkbox} onPress={() => onComplete && onComplete(task.id)}>
        <View style={styles.circle} />
      </TouchableOpacity>
      <View style={styles.content}>
        <Text style={styles.title}>{task.title}</Text>
        <Text style={styles.description} numberOfLines={1}>{task.description}</Text>
        <View style={styles.metaRow}>
          <Text style={styles.dueDate}>Due {formattedDate}</Text>
          <View style={[styles.priorityBadge, { backgroundColor: priorityStyle.bg }]}>
            <Text style={[styles.priorityText, { color: priorityStyle.text }]}>{task.priority}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 12,
    marginBottom: 8,
  },
  checkbox: {
    padding: 4,
    marginRight: 8,
    marginTop: 2,
  },
  circle: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: '#9CA3AF',
  },
  content: {
    flex: 1,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: '#111827',
  },
  description: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  dueDate: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  priorityBadge: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
