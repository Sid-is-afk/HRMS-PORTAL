import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function ApprovalTimeline({ history = [] }) {
  if (!history || history.length === 0) {
    return <Text style={styles.empty}>No timeline actions recorded.</Text>;
  }

  const formatDate = (isoStr) => {
    try {
      return new Date(isoStr).toLocaleString(undefined, {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <Card style={styles.card}>
      <Card.Title title="Approval Lifecycle Timeline" titleStyle={styles.title} />
      <Card.Content style={styles.content}>
        {history.map((item, index) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.lineIndicator}>
              <View style={[styles.dot, item.action === 'APPROVED' ? styles.approvedDot : styles.rejectedDot]} />
              {index < history.length - 1 ? <View style={styles.verticalLine} /> : null}
            </View>
            <View style={styles.info}>
              <Text style={styles.actionTitle}>{item.action}</Text>
              <Text style={styles.desc}>Performed by {item.performedBy}</Text>
              {item.comment ? <Text style={styles.comment}>"{item.comment}"</Text> : null}
              <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
            </View>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  content: {
    paddingTop: 0,
  },
  item: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  lineIndicator: {
    alignItems: 'center',
    marginRight: 12,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#3B82F6',
    marginTop: 4,
  },
  approvedDot: {
    backgroundColor: '#10B981',
  },
  rejectedDot: {
    backgroundColor: '#EF4444',
  },
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  info: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  desc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  comment: {
    fontSize: 12,
    fontStyle: 'italic',
    color: '#4B5563',
    backgroundColor: '#F9FAFB',
    padding: 6,
    borderRadius: 4,
    marginTop: 4,
  },
  date: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 4,
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 16,
  },
});
