import React from 'react';
import { StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';

export default function TeamCard({ team }) {
  const { name, memberCount } = team;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <Text style={styles.name}>{name}</Text>
        <Chip style={styles.memberBadge}>{memberCount} Members</Chip>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 8,
  },
  content: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  memberBadge: {
    backgroundColor: '#EFF6FF',
    height: 24,
    borderRadius: 6,
  },
});
