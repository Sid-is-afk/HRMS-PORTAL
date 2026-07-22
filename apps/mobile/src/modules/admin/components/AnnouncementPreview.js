import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function AnnouncementPreview({ announcements }) {
  if (!announcements || announcements.length === 0) {
    return <Text style={styles.empty}>No announcements posted.</Text>;
  }

  return (
    <View style={styles.container}>
      {announcements.map((item) => (
        <Card key={item.id} style={styles.card}>
          <Card.Content style={styles.content}>
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.summary}>{item.summary}</Text>
            <View style={styles.footer}>
              <Text style={styles.meta}>{item.author}</Text>
              <Text style={styles.meta}>
                {new Date(item.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                })}
              </Text>
            </View>
          </Card.Content>
        </Card>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 4,
  },
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 8,
    marginBottom: 10,
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  content: {
    padding: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 4,
  },
  summary: {
    fontSize: 12,
    color: '#4B5563',
    marginBottom: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  meta: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  empty: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 16,
  },
});
