import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function EmployeeTimeline({ timeline = [] }) {
  if (!timeline || timeline.length === 0) {
    return <Text style={styles.empty}>No timeline events recorded.</Text>;
  }

  return (
    <Card style={styles.card}>
      <Card.Title title="Activity Timeline" titleStyle={styles.title} />
      <Card.Content style={styles.content}>
        {timeline.map((item, index) => (
          <View key={item.id} style={styles.item}>
            <View style={styles.lineIndicator}>
              <View style={styles.dot} />
              {index < timeline.length - 1 ? <View style={styles.verticalLine} /> : null}
            </View>
            <View style={styles.info}>
              <Text style={styles.eventTitle}>{item.title}</Text>
              <Text style={styles.desc}>{item.desc}</Text>
              <Text style={styles.date}>
                {new Date(item.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </Text>
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
  verticalLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E5E7EB',
    marginTop: 4,
  },
  info: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  desc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
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
