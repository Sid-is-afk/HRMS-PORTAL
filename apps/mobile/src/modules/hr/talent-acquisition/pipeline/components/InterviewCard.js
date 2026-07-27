import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { Calendar, Clock } from 'lucide-react-native';

export default function InterviewCard({ interview, onPress }) {
  const { candidateName, jobTitle, type, mode, date, time, status, roundNumber } = interview;

  const getStatusStyle = () => {
    switch (status) {
      case 'COMPLETED':
        return { bg: '#D1FAE5', text: '#065F46' };
      case 'CANCELLED':
        return { bg: '#FEE2E2', text: '#B91C1C' };
      default:
        return { bg: '#FEF3C7', text: '#92400E' };
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <Card style={styles.card} mode="outlined">
      <Pressable onPress={onPress} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleInfo}>
            <Text style={styles.candidate}>{candidateName}</Text>
            <Text style={styles.job} numberOfLines={1}>{jobTitle}</Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusStyle.bg }]}>
            <Text style={[styles.statusText, { color: statusStyle.text }]}>{status}</Text>
          </View>
        </View>

        <View style={styles.divider} />

        <View style={styles.detailsGrid}>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{type} (R{roundNumber})</Text>
          </View>
          <View style={styles.tag}>
            <Text style={styles.tagText}>{mode}</Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View style={styles.iconRow}>
            <Calendar size={14} color="#6B7280" />
            <Text style={styles.footerText}>{date}</Text>
          </View>
          <View style={styles.iconRow}>
            <Clock size={14} color="#6B7280" />
            <Text style={styles.footerText}>{time}</Text>
          </View>
        </View>
      </Pressable>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  titleInfo: {
    flex: 1,
    paddingRight: 8,
  },
  candidate: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  job: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginBottom: 10,
  },
  detailsGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  tag: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  tagText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '600',
  },
  footer: {
    flexDirection: 'row',
    gap: 16,
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  footerText: {
    fontSize: 12,
    color: '#6B7280',
  },
});
