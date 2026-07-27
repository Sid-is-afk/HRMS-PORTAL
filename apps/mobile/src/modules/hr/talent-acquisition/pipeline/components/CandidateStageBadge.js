import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const STAGE_CONFIGS = {
  APPLIED: { label: 'Applied', bg: '#F3F4F6', text: '#374151' },
  SCREENING: { label: 'Screening', bg: '#DBEAFE', text: '#1E40AF' },
  SHORTLISTED: { label: 'Shortlisted', bg: '#D1FAE5', text: '#065F46' },
  ASSESSMENT: { label: 'Assessment', bg: '#FEF3C7', text: '#92400E' },
  TECHNICAL_INTERVIEW: { label: 'Tech Round', bg: '#F3E8FF', text: '#6B21A8' },
  MANAGER_INTERVIEW: { label: 'Mgr Round', bg: '#FCE7F3', text: '#9D174D' },
  HR_INTERVIEW: { label: 'HR Round', bg: '#E0F2FE', text: '#0369A1' },
  FINAL_REVIEW: { label: 'Final Review', bg: '#E0E7FF', text: '#3730A3' },
  SELECTED: { label: 'Selected', bg: '#ECFDF5', text: '#047857' },
  REJECTED: { label: 'Rejected', bg: '#FEE2E2', text: '#B91C1C' },
  WITHDRAWN: { label: 'Withdrawn', bg: '#E5E7EB', text: '#4B5563' },
};

export default function CandidateStageBadge({ stage }) {
  const config = STAGE_CONFIGS[stage] || { label: stage, bg: '#F3F4F6', text: '#374151' };

  return (
    <View style={[styles.badge, { backgroundColor: config.bg }]}>
      <Text style={[styles.text, { color: config.text }]}>{config.label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    alignSelf: 'flex-start',
  },
  text: {
    fontSize: 11,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
});
