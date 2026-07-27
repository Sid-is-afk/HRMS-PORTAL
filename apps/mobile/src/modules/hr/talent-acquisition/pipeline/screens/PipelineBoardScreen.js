import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { Text, Portal, Modal, Button, RadioButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useCandidatePipeline } from '../hooks/useCandidatePipeline';
import PipelineColumn from '../components/PipelineColumn';

const STAGE_OPTIONS = [
  { label: 'Applied', value: 'APPLIED' },
  { label: 'Screening', value: 'SCREENING' },
  { label: 'Shortlisted', value: 'SHORTLISTED' },
  { label: 'Assessment', value: 'ASSESSMENT' },
  { label: 'Tech Round', value: 'TECHNICAL_INTERVIEW' },
  { label: 'Mgr Round', value: 'MANAGER_INTERVIEW' },
  { label: 'HR Round', value: 'HR_INTERVIEW' },
  { label: 'Final Review', value: 'FINAL_REVIEW' },
  { label: 'Selected', value: 'SELECTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
];

export default function PipelineBoardScreen() {
  const navigation = useNavigation();
  const { pipeline, isLoading, refresh, updateCandidateStage } = useCandidatePipeline();

  const [activeCandidate, setActiveCandidate] = useState(null);
  const [targetStage, setTargetStage] = useState('');
  const [showMoveModal, setShowMoveModal] = useState(false);

  if (isLoading && pipeline.length === 0) {
    return (
      <HRWorkspaceScreen title="Recruitment Pipeline">
        <View style={styles.loading}>
          <ActivityIndicator size="large" color="#2563EB" />
          <Text style={styles.loadingText}>Loading recruitment columns...</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  const handleCandidatePress = (cand) => {
    navigation.navigate('CandidateProfile', { candidateId: cand.id });
  };

  const handleMovePress = (cand) => {
    setActiveCandidate(cand);
    setTargetStage(cand.stage);
    setShowMoveModal(true);
  };

  const executeStageTransition = async () => {
    if (!activeCandidate) return;
    try {
      await updateCandidateStage(activeCandidate.id, targetStage);
      setShowMoveModal(false);
      setActiveCandidate(null);
      Alert.alert('Success', 'Candidate advanced/moved to new stage.');
      refresh();
    } catch (err) {
      Alert.alert('Transition Refused', err.message || 'Workflow transition rules denied.');
    }
  };

  return (
    <HRWorkspaceScreen title="Hiring Pipeline Board">
      <View style={styles.container}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={true}
          contentContainerStyle={styles.boardScroll}
        >
          {pipeline.map((stage) => (
            <PipelineColumn
              key={stage.id}
              stage={stage}
              onCandidatePress={handleCandidatePress}
              onMoveCandidate={handleMovePress}
            />
          ))}
        </ScrollView>

        <Portal>
          <Modal visible={showMoveModal} onDismiss={() => setShowMoveModal(false)} contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>
              Move Candidate: {activeCandidate?.firstName} {activeCandidate?.lastName}
            </Text>
            <Text style={styles.modalSubtitle}>Select target hiring stage:</Text>

            <ScrollView style={styles.radioScroll} showsVerticalScrollIndicator={false}>
              <RadioButton.Group onValueChange={setTargetStage} value={targetStage}>
                {STAGE_OPTIONS.map((opt) => (
                  <View key={opt.value} style={styles.radioRow}>
                    <RadioButton.Android value={opt.value} color="#2563EB" />
                    <Text style={styles.radioLabel}>{opt.label}</Text>
                  </View>
                ))}
              </RadioButton.Group>
            </ScrollView>

            <View style={styles.actions}>
              <Button mode="outlined" onPress={() => setShowMoveModal(false)} style={styles.btn} textColor="#4B5563">
                Cancel
              </Button>
              <Button mode="contained" onPress={executeStageTransition} style={[styles.btn, styles.applyBtn]} buttonColor="#2563EB">
                Confirm Move
              </Button>
            </View>
          </Modal>
        </Portal>
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '600',
  },
  boardScroll: {
    padding: 16,
    flexDirection: 'row',
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
  },
  radioScroll: {
    maxHeight: 300,
    marginBottom: 16,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  radioLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
  },
  btn: {
    flex: 1,
    borderRadius: 8,
  },
  applyBtn: {
    elevation: 0,
  },
});
