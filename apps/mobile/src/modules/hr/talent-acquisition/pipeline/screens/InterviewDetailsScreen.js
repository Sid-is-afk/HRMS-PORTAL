import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Portal, Modal, TextInput } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useCandidate } from '../hooks/useCandidate';
import { useInterviewSchedule } from '../hooks/useInterviewSchedule';
import { Calendar, Clock, Video } from 'lucide-react-native';

export default function InterviewDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { interviewId, candidateId } = route.params || {};

  const { candidate, refresh } = useCandidate(candidateId);
  const { rescheduleInterview, cancelInterview } = useInterviewSchedule();

  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [newDate, setNewDate] = useState('2026-07-30');
  const [newTime, setNewTime] = useState('15:00');

  const interview = candidate?.interviews?.find((i) => i.id === interviewId);

  if (!interview) {
    return (
      <HRWorkspaceScreen title="Interview Details">
        <View style={styles.container}>
          <Text style={styles.errorText}>Interview panel details could not be found.</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  const handleReschedule = async () => {
    try {
      await rescheduleInterview(interviewId, { date: newDate, time: newTime }, candidateId);
      Alert.alert('Success', 'Interview rescheduled successfully.');
      setShowRescheduleModal(false);
      refresh();
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to reschedule.');
    }
  };

  const handleCancel = () => {
    Alert.alert(
      'Cancel Interview',
      'Are you sure you want to cancel this round?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelInterview(interviewId, candidateId);
              Alert.alert('Cancelled', 'Interview has been cancelled.');
              navigation.goBack();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to cancel.');
            }
          }
        }
      ]
    );
  };

  return (
    <HRWorkspaceScreen title="Interview Details">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        
        <Card style={styles.mainCard} mode="outlined">
          <Card.Content>
            <Text style={styles.round}>Round {interview.roundNumber} - {interview.type}</Text>
            <Text style={styles.candidateName}>{interview.candidateName}</Text>
            <Text style={styles.jobTitle}>{interview.jobTitle}</Text>
            
            <View style={[styles.statusBadge, interview.status === 'COMPLETED' ? styles.completedBg : interview.status === 'CANCELLED' ? styles.cancelledBg : styles.pendingBg]}>
              <Text style={[styles.statusText, interview.status === 'COMPLETED' ? styles.completedText : interview.status === 'CANCELLED' ? styles.cancelledText : interview.status === 'pendingText']}>
                {interview.status}
              </Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="outlined">
          <Card.Content style={styles.details}>
            <View style={styles.detailRow}>
              <Calendar size={18} color="#4B5563" />
              <Text style={styles.detailText}>{interview.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Clock size={18} color="#4B5563" />
              <Text style={styles.detailText}>{interview.time}</Text>
            </View>
            <View style={styles.detailRow}>
              <Video size={18} color="#4B5563" />
              <Text style={styles.detailText}>{interview.mode} {interview.meetingLink ? `(${interview.meetingLink})` : ''}</Text>
            </View>
          </Card.Content>
        </Card>

        <Card style={styles.card} mode="outlined">
          <Card.Content>
            <Text style={styles.sectionTitle}>Interviewer Panel</Text>
            {interview.panelMembers.map((member) => (
              <View key={member.employeeId} style={styles.panelMember}>
                <AvatarText initials={member.name.split(' ').map(n=>n[0]).join('')} />
                <View style={styles.panelInfo}>
                  <Text style={styles.panelName}>{member.name}</Text>
                  <Text style={styles.panelEmail}>{member.email}</Text>
                </View>
              </View>
            ))}
          </Card.Content>
        </Card>

        {interview.status === 'PENDING' && (
          <View style={styles.actions}>
            <Button mode="outlined" onPress={() => setShowRescheduleModal(true)} style={[styles.btn, styles.reschedBtn]} textColor="#2563EB">
              Reschedule
            </Button>
            <Button mode="outlined" onPress={handleCancel} style={[styles.btn, styles.cancelBtn]} textColor="#DC2626">
              Cancel Panel
            </Button>
            <Button 
              mode="contained" 
              buttonColor="#2563EB" 
              onPress={() => navigation.navigate('FeedbackForm', { interviewId: interview.id, candidateId })} 
              style={[styles.btn, styles.submitBtn]}
            >
              Submit Feedback
            </Button>
          </View>
        )}
      </ScrollView>

      <Portal>
        <Modal visible={showRescheduleModal} onDismiss={() => setShowRescheduleModal(false)} contentContainerStyle={styles.modal}>
          <Text style={styles.modalTitle}>Reschedule Interview Slot</Text>
          <TextInput label="Date (YYYY-MM-DD)" value={newDate} onChangeText={setNewDate} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
          <TextInput label="Time (e.g. 15:00)" value={newTime} onChangeText={setNewTime} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
          
          <View style={styles.modalActions}>
            <Button mode="outlined" onPress={() => setShowRescheduleModal(false)} style={styles.modalBtn} textColor="#4B5563">
              Cancel
            </Button>
            <Button mode="contained" onPress={handleReschedule} style={styles.modalBtn} buttonColor="#2563EB">
              Reschedule
            </Button>
          </View>
        </Modal>
      </Portal>
    </HRWorkspaceScreen>
  );
}

// Simple internal Avatar Text implementation
function AvatarText({ initials }) {
  return (
    <View style={styles.avatar}>
      <Text style={styles.avatarText}>{initials}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F9FAFB',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
    textAlign: 'center',
    marginTop: 32,
  },
  mainCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
    marginBottom: 16,
  },
  round: {
    fontSize: 12,
    fontWeight: '800',
    color: '#2563EB',
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  candidateName: {
    fontSize: 20,
    fontWeight: '800',
    color: '#1F2937',
  },
  jobTitle: {
    fontSize: 14,
    color: '#4B5563',
    marginTop: 2,
    marginBottom: 12,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  pendingBg: { backgroundColor: '#FEF3C7' },
  completedBg: { backgroundColor: '#D1FAE5' },
  completedText: { color: '#065F46' },
  cancelledBg: { backgroundColor: '#FEE2E2' },
  cancelledText: { color: '#B91C1C' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderColor: '#E5E7EB',
    borderWidth: 1,
    elevation: 0,
    marginBottom: 16,
  },
  details: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  detailText: {
    fontSize: 14,
    color: '#374151',
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  panelMember: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 10,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: '#2563EB',
    fontSize: 12,
    fontWeight: '700',
  },
  panelInfo: {
    flex: 1,
  },
  panelName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1F2937',
  },
  panelEmail: {
    fontSize: 11,
    color: '#6B7280',
  },
  actions: {
    flexDirection: 'column',
    gap: 8,
    paddingBottom: 32,
  },
  btn: {
    borderRadius: 8,
  },
  reschedBtn: {
    borderColor: '#2563EB',
  },
  cancelBtn: {
    borderColor: '#DC2626',
  },
  submitBtn: {
    elevation: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  modalBtn: {
    flex: 1,
    borderRadius: 8,
  },
});
