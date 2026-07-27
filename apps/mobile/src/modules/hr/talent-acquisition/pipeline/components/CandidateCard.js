import React from 'react';
import { View, StyleSheet, Pressable } from 'react-native';
import { Text, Card } from 'react-native-paper';
import { ChevronRight, Briefcase, GraduationCap } from 'lucide-react-native';
import CandidateStageBadge from './CandidateStageBadge';

export default function CandidateCard({ candidate, onPress }) {
  const { firstName, lastName, currentJobTitle, experienceYears, education, skills, stage, status } = candidate;
  const fullName = `${firstName} ${lastName}`;

  return (
    <Card style={styles.card} mode="outlined">
      <Pressable onPress={onPress} style={styles.container}>
        <View style={styles.header}>
          <View style={styles.titleContainer}>
            <Text style={styles.name}>{fullName}</Text>
            <Text style={styles.jobTitle}>{currentJobTitle}</Text>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>

        <View style={styles.infoRow}>
          <View style={styles.infoItem}>
            <Briefcase size={14} color="#6B7280" />
            <Text style={styles.infoText}>{experienceYears} yrs exp</Text>
          </View>
          <View style={styles.infoItem}>
            <GraduationCap size={14} color="#6B7280" />
            <Text style={styles.infoText} numberOfLines={1}>{education}</Text>
          </View>
        </View>

        <View style={styles.skillsRow}>
          {skills.slice(0, 3).map((skill, index) => (
            <View key={index} style={styles.skillBadge}>
              <Text style={styles.skillText}>{skill}</Text>
            </View>
          ))}
          {skills.length > 3 && (
            <Text style={styles.moreSkills}>+{skills.length - 3} more</Text>
          )}
        </View>

        <View style={styles.footer}>
          <CandidateStageBadge stage={stage} />
          {status !== 'ACTIVE' && (
            <View style={[styles.statusBadge, status === 'SELECTED' ? styles.selectedBg : styles.rejectedBg]}>
              <Text style={[styles.statusText, status === 'SELECTED' ? styles.selectedText : styles.rejectedText]}>
                {status}
              </Text>
            </View>
          )}
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
    overflow: 'hidden',
  },
  container: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  titleContainer: {
    flex: 1,
    paddingRight: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1F2937',
  },
  jobTitle: {
    fontSize: 13,
    color: '#4B5563',
    marginTop: 2,
  },
  infoRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    fontSize: 12,
    color: '#6B7280',
  },
  skillsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    alignItems: 'center',
    marginBottom: 12,
  },
  skillBadge: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
  },
  skillText: {
    fontSize: 11,
    color: '#2563EB',
    fontWeight: '500',
  },
  moreSkills: {
    fontSize: 11,
    color: '#6B7280',
    marginLeft: 2,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
    marginTop: 4,
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  selectedBg: {
    backgroundColor: '#D1FAE5',
  },
  rejectedBg: {
    backgroundColor: '#FEE2E2',
  },
  statusText: {
    fontSize: 10,
    fontWeight: '700',
  },
  selectedText: {
    color: '#065F46',
  },
  rejectedText: {
    color: '#B91C1C',
  },
});
