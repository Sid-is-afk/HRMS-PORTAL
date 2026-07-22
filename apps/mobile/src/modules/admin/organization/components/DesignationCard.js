import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';

export default function DesignationCard({ designation, onPress }) {
  const { title, level, description, status } = designation;

  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <View style={styles.header}>
          <Text style={styles.title}>{title}</Text>
          <Chip style={styles.levelBadge}>Level {level}</Chip>
        </View>
        {description ? <Text style={styles.desc} numberOfLines={2}>{description}</Text> : null}
        <View style={styles.footer}>
          <Chip style={[styles.statusChip, status === 'ACTIVE' ? styles.activeChip : styles.archivedChip]}>
            {status}
          </Chip>
        </View>
      </TouchableOpacity>
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
    marginBottom: 12,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  levelBadge: {
    backgroundColor: '#F3F4F6',
    height: 24,
    borderRadius: 6,
  },
  desc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginBottom: 12,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
  },
  statusChip: {
    height: 22,
    borderRadius: 4,
  },
  activeChip: {
    backgroundColor: '#E6F4EA',
  },
  archivedChip: {
    backgroundColor: '#FCE8E6',
  },
});
