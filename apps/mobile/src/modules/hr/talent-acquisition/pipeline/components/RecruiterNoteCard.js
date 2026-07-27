import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card } from 'react-native-paper';

export default function RecruiterNoteCard({ note }) {
  const { authorName, content, createdAt } = note;
  const formattedDate = new Date(createdAt).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.author}>{authorName}</Text>
          <Text style={styles.date}>{formattedDate}</Text>
        </View>
        <Text style={styles.text}>{content}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
    marginBottom: 8,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  author: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
  },
  date: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  text: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
  },
});
