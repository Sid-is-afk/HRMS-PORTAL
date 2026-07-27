import React, { useState } from 'react';
import { View, StyleSheet, Modal, ScrollView } from 'react-native';
import { Text, Button, RadioButton, TextInput } from 'react-native-paper';
import { X } from 'lucide-react-native';

const STAGE_OPTIONS = [
  { label: 'All Stages', value: 'all' },
  { label: 'Applied', value: 'APPLIED' },
  { label: 'Screening', value: 'SCREENING' },
  { label: 'Assessment', value: 'ASSESSMENT' },
  { label: 'Tech Round', value: 'TECHNICAL_INTERVIEW' },
  { label: 'Mgr Round', value: 'MANAGER_INTERVIEW' },
  { label: 'HR Round', value: 'HR_INTERVIEW' },
  { label: 'Selected', value: 'SELECTED' },
  { label: 'Rejected', value: 'REJECTED' },
];

const STATUS_OPTIONS = [
  { label: 'All Statuses', value: 'all' },
  { label: 'Active', value: 'ACTIVE' },
  { label: 'Selected', value: 'SELECTED' },
  { label: 'Rejected', value: 'REJECTED' },
  { label: 'Withdrawn', value: 'WITHDRAWN' },
];

export default function CandidateFilterPanel({ visible, filters, onDismiss, onApply, onReset }) {
  const [selectedStage, setSelectedStage] = useState(filters.stage || 'all');
  const [selectedStatus, setSelectedStatus] = useState(filters.status || 'all');
  const [minExp, setMinExp] = useState(filters.experienceMin || '');
  const [skillText, setSkillText] = useState(filters.skill || '');

  const handleApply = () => {
    onApply({
      stage: selectedStage,
      status: selectedStatus,
      experienceMin: minExp,
      skill: skillText,
    });
    onDismiss();
  };

  const handleReset = () => {
    setSelectedStage('all');
    setSelectedStatus('all');
    setMinExp('');
    setSkillText('');
    onReset();
    onDismiss();
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onDismiss}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Filter Candidates</Text>
          <Button icon={() => <X size={20} color="#374151" />} onPress={onDismiss} style={styles.closeBtn}>
            Close
          </Button>
        </View>

        <ScrollView style={styles.scroll}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Hiring Stage</Text>
            <RadioButton.Group onValueChange={setSelectedStage} value={selectedStage}>
              {STAGE_OPTIONS.map((opt) => (
                <View key={opt.value} style={styles.radioRow}>
                  <RadioButton.Android value={opt.value} color="#2563EB" />
                  <Text style={styles.radioLabel}>{opt.label}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Application Status</Text>
            <RadioButton.Group onValueChange={setSelectedStatus} value={selectedStatus}>
              {STATUS_OPTIONS.map((opt) => (
                <View key={opt.value} style={styles.radioRow}>
                  <RadioButton.Android value={opt.value} color="#2563EB" />
                  <Text style={styles.radioLabel}>{opt.label}</Text>
                </View>
              ))}
            </RadioButton.Group>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Min Experience (Years)</Text>
            <TextInput
              mode="outlined"
              placeholder="e.g. 3"
              value={minExp}
              onChangeText={setMinExp}
              keyboardType="numeric"
              style={styles.input}
              outlineColor="#D1D5DB"
              activeOutlineColor="#2563EB"
            />
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Skills Required</Text>
            <TextInput
              mode="outlined"
              placeholder="e.g. React Native"
              value={skillText}
              onChangeText={setSkillText}
              style={styles.input}
              outlineColor="#D1D5DB"
              activeOutlineColor="#2563EB"
            />
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <Button mode="outlined" onPress={handleReset} style={styles.btn} textColor="#4B5563">
            Reset All
          </Button>
          <Button mode="contained" onPress={handleApply} style={[styles.btn, styles.applyBtn]} buttonColor="#2563EB">
            Apply Filters
          </Button>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1F2937',
  },
  closeBtn: {
    margin: 0,
  },
  scroll: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
    marginBottom: 10,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  radioLabel: {
    fontSize: 14,
    color: '#4B5563',
    marginLeft: 8,
  },
  input: {
    backgroundColor: '#FFFFFF',
    height: 44,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
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
