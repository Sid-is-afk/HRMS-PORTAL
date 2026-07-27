import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { Calendar, Clock, Video, User } from 'lucide-react-native';

export default function InterviewScheduleCard({ interview, onCancel, onFeedback }) {
  const { type, mode, date, time, panelMembers, meetingLink, status, roundNumber } = interview;

  return (
    <Card style={styles.card} mode="outlined">
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>{type} Interview (Round {roundNumber})</Text>
          <View style={[styles.statusBadge, status === 'COMPLETED' ? styles.completedBg : status === 'CANCELLED' ? styles.cancelledBg : styles.pendingBg]}>
            <Text style={[styles.statusText, status === 'COMPLETED' ? styles.completedText : status === 'CANCELLED' ? styles.cancelledText : styles.pendingText]}>
              {status}
            </Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.item}>
            <Calendar size={16} color="#4B5563" />
            <Text style={styles.text}>{date}</Text>
          </View>
          <View style={styles.item}>
            <Clock size={16} color="#4B5563" />
            <Text style={styles.text}>{time}</Text>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.item}>
            <Video size={16} color="#4B5563" />
            <Text style={styles.text}>{mode} {meetingLink ? `(${meetingLink})` : ''}</Text>
          </View>
        </View>

        <View style={styles.panelSection}>
          <Text style={styles.sectionTitle}>Panel Members:</Text>
          {panelMembers.map((member, index) => (
            <View key={index} style={styles.member}>
              <User size={14} color="#6B7280" />
              <Text style={styles.memberText}>{member.name} ({member.email})</Text>
            </View>
          ))}
        </View>

        {status === 'PENDING' && (
          <View style={styles.actions}>
            {onCancel && (
              <Button
                mode="outlined"
                textColor="#DC2626"
                style={[styles.btn, styles.cancelBtn]}
                onPress={onCancel}
              >
                Cancel
              </Button>
            )}
            {onFeedback && (
              <Button
                mode="contained"
                buttonColor="#2563EB"
                style={styles.btn}
                onPress={onFeedback}
              >
                Enter Feedback
              </Button>
            )}
          </View>
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
    marginBottom: 12,
  },
  content: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pendingBg: { backgroundColor: '#FEF3C7' },
  pendingText: { color: '#D97706' },
  completedBg: { backgroundColor: '#D1FAE5' },
  completedText: { color: '#065F46' },
  cancelledBg: { backgroundColor: '#FEE2E2' },
  cancelledText: { color: '#B91C1C' },
  row: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  text: {
    fontSize: 13,
    color: '#4B5563',
  },
  panelSection: {
    marginTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingTop: 10,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  member: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  memberText: {
    fontSize: 12,
    color: '#4B5563',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 8,
    marginTop: 14,
  },
  btn: {
    borderRadius: 8,
  },
  cancelBtn: {
    borderColor: '#DC2626',
  },
});
