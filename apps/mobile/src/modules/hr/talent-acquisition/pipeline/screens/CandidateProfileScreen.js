import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, TextInput, Portal, Modal, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useCandidate } from '../hooks/useCandidate';
import { useInterviewSchedule } from '../hooks/useInterviewSchedule';
import CandidateProfileHeader from '../components/CandidateProfileHeader';
import InterviewScheduleCard from '../components/InterviewScheduleCard';
import RecruiterNoteCard from '../components/RecruiterNoteCard';
import { interviewSchedulingSchema, recruiterNoteSchema } from '../validation/pipelineSchema';

export default function CandidateProfileScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { candidateId } = route.params || {};

  const { candidate, isLoading, error, refresh, addNote } = useCandidate(candidateId);
  const { scheduleInterview, cancelInterview } = useInterviewSchedule();

  const [noteText, setNoteText] = useState('');
  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [showNoteForm, setShowNoteForm] = useState(false);

  // Schedule Interview Form State
  const [roundNumber, setRoundNumber] = useState('1');
  const [type, setType] = useState('TECHNICAL');
  const [mode, setMode] = useState('ONLINE');
  const [date, setDate] = useState('2026-07-29');
  const [time, setTime] = useState('14:30');
  const [panelName, setPanelName] = useState('Ramesh Babu');
  const [panelEmail, setPanelEmail] = useState('ramesh.babu@company.com');
  const [panelEmpId, setPanelEmpId] = useState('emp-tech1');
  const [formError, setFormError] = useState('');

  if (isLoading && !candidate) {
    return (
      <HRWorkspaceScreen title="Candidate Profile">
        <View style={styles.loading}>
          <Text style={styles.loadingText}>Loading candidate dossier...</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  if (error || !candidate) {
    return (
      <HRWorkspaceScreen title="Candidate Profile">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error || 'Candidate profile not found.'}</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  const handleAddNote = async () => {
    const noteValidation = recruiterNoteSchema.safeParse({ content: noteText });
    if (!noteValidation.success) {
      Alert.alert('Validation Error', noteValidation.error.errors[0]?.message);
      return;
    }

    try {
      await addNote(noteText);
      setNoteText('');
      setShowNoteForm(false);
      Alert.alert('Success', 'Recruiter note recorded.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to append note.');
    }
  };

  const handleSchedule = async () => {
    setFormError('');

    const inputData = {
      candidateId,
      roundNumber: parseInt(roundNumber, 10),
      type,
      mode,
      date,
      time,
      panelMembers: [{
        employeeId: panelEmpId,
        name: panelName,
        email: panelEmail,
      }],
      meetingLink: mode === 'ONLINE' ? 'https://meet.google.com/mock-link' : '',
    };

    const validation = interviewSchedulingSchema.safeParse(inputData);
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || 'Scheduling validation failed.');
      return;
    }

    try {
      await scheduleInterview(candidateId, validation.data);
      Alert.alert('Success', 'Interview scheduled and calendar notification dispatched.');
      setShowScheduleModal(false);
      refresh();
    } catch (err) {
      setFormError(err.message || 'Failed to schedule interview round.');
    }
  };

  const handleCancelInterview = async (interviewId) => {
    Alert.alert(
      'Cancel Interview',
      'Are you sure you want to cancel this interview round?',
      [
        { text: 'No', style: 'cancel' },
        {
          text: 'Yes, Cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              await cancelInterview(interviewId, candidateId);
              Alert.alert('Cancelled', 'Interview session cancelled.');
              refresh();
            } catch (err) {
              Alert.alert('Error', err.message || 'Failed to cancel.');
            }
          }
        }
      ]
    );
  };

  return (
    <HRWorkspaceScreen title="Candidate Dossier">
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <CandidateProfileHeader candidate={candidate} />

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Key Skills</Text>
          <View style={styles.skillsContainer}>
            {candidate.skills.map((skill, index) => (
              <View key={index} style={styles.skillBadge}>
                <Text style={styles.skillText}>{skill}</Text>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Card style={styles.resumeCard} mode="outlined">
            <Card.Content style={styles.resumeContent}>
              <View>
                <Text style={styles.resumeTitle}>Resume / CV Dossier</Text>
                <Text style={styles.resumeMeta}>{candidate.resumeMetadata || 'No CV file attached.'}</Text>
              </View>
              <Button mode="outlined" style={styles.resumeBtn} textColor="#2563EB">Preview</Button>
            </Card.Content>
          </Card>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Interview Schedules</Text>
            <Button mode="text" textColor="#2563EB" onPress={() => setShowScheduleModal(true)}>
              Schedule
            </Button>
          </View>
          {candidate.interviews && candidate.interviews.length > 0 ? (
            candidate.interviews.map((item) => (
              <InterviewScheduleCard
                key={item.id}
                interview={item}
                onCancel={() => handleCancelInterview(item.id)}
                onFeedback={() => navigation.navigate('FeedbackForm', { interviewId: item.id, candidateId })}
              />
            ))
          ) : (
            <Text style={styles.emptyText}>No interviews scheduled.</Text>
          )}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recruiter Comments</Text>
            <Button mode="text" textColor="#2563EB" onPress={() => setShowNoteForm(!showNoteForm)}>
              {showNoteForm ? 'Collapse' : 'Add Note'}
            </Button>
          </View>

          {showNoteForm && (
            <View style={styles.noteForm}>
              <TextInput
                mode="outlined"
                placeholder="Append assessment comments..."
                value={noteText}
                onChangeText={setNoteText}
                multiline
                numberOfLines={3}
                style={styles.noteInput}
                activeOutlineColor="#2563EB"
              />
              <Button mode="contained" buttonColor="#2563EB" onPress={handleAddNote} style={styles.noteSubmit}>
                Save Note
              </Button>
            </View>
          )}

          {candidate.notes && candidate.notes.length > 0 ? (
            candidate.notes.map((item) => (
              <RecruiterNoteCard key={item.id} note={item} />
            ))
          ) : (
            <Text style={styles.emptyText}>No comments recorded.</Text>
          )}
        </View>

        <View style={styles.actionRow}>
          <Button
            mode="contained"
            buttonColor="#2563EB"
            onPress={() => navigation.navigate('CandidateTimeline', { candidateId })}
            style={styles.timelineBtn}
          >
            View Hiring Timeline
          </Button>
        </View>
      </ScrollView>

      <Portal>
        <Modal visible={showScheduleModal} onDismiss={() => setShowScheduleModal(false)} contentContainerStyle={styles.modal}>
          <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
            <Text style={styles.modalTitle}>Schedule Interview Panel</Text>

            {formError ? (
              <View style={styles.errorBox}>
                <Text style={styles.formErrorText}>{formError}</Text>
              </View>
            ) : null}

            <TextInput label="Round Number" value={roundNumber} onChangeText={setRoundNumber} keyboardType="numeric" mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
            
            <Text style={styles.label}>Interview Stage Type</Text>
            <View style={styles.chipRow}>
              {['SCREENING', 'TECHNICAL', 'MANAGER', 'HR'].map(t => (
                <Chip key={t} selected={type === t} onPress={() => setType(t)} selectedColor="#2563EB" style={styles.chip}>{t}</Chip>
              ))}
            </View>

            <Text style={styles.label}>Meeting Mode</Text>
            <View style={styles.chipRow}>
              {['ONLINE', 'IN_PERSON', 'PHONE'].map(m => (
                <Chip key={m} selected={mode === m} onPress={() => setMode(m)} selectedColor="#2563EB" style={styles.chip}>{m}</Chip>
              ))}
            </View>

            <TextInput label="Date (YYYY-MM-DD)" value={date} onChangeText={setDate} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
            <TextInput label="Time (e.g. 14:30)" value={time} onChangeText={setTime} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
            
            <Text style={styles.sectionLabel}>Interviewer Details</Text>
            <TextInput label="Name" value={panelName} onChangeText={setPanelName} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
            <TextInput label="Email" value={panelEmail} onChangeText={setPanelEmail} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" autoCapitalize="none" />
            <TextInput label="Employee ID" value={panelEmpId} onChangeText={setPanelEmpId} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />

            <Button mode="contained" buttonColor="#2563EB" style={styles.submitBtn} onPress={handleSchedule}>
              Schedule Slot
            </Button>
          </ScrollView>
        </Modal>
      </Portal>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
  },
  section: {
    backgroundColor: '#FFFFFF',
    marginTop: 12,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: '#374151',
    textTransform: 'uppercase',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  skillBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 8,
  },
  skillText: {
    fontSize: 12,
    color: '#2563EB',
    fontWeight: '600',
  },
  resumeCard: {
    borderColor: '#E5E7EB',
    elevation: 0,
  },
  resumeContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  resumeTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  resumeMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  resumeBtn: {
    borderColor: '#2563EB',
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 12,
  },
  noteForm: {
    backgroundColor: '#F9FAFB',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    marginBottom: 12,
  },
  noteInput: {
    backgroundColor: '#FFFFFF',
    marginBottom: 8,
  },
  noteSubmit: {
    alignSelf: 'flex-end',
    borderRadius: 6,
  },
  actionRow: {
    padding: 24,
    alignItems: 'center',
  },
  timelineBtn: {
    width: '100%',
    borderRadius: 8,
    elevation: 0,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '85%',
  },
  modalScroll: {
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 16,
  },
  input: {
    backgroundColor: '#FFFFFF',
    marginBottom: 12,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    marginVertical: 6,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
  },
  chip: {
    backgroundColor: '#F3F4F6',
  },
  sectionLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 8,
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 4,
  },
  submitBtn: {
    marginTop: 16,
    borderRadius: 8,
  },
  errorBox: {
    backgroundColor: '#FEF2F2',
    padding: 10,
    borderRadius: 6,
    borderLeftWidth: 3,
    borderLeftColor: '#DC2626',
    marginBottom: 12,
  },
  formErrorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
});
