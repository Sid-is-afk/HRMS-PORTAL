import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Chip } from 'react-native-paper';
import JobStatusBadge from './JobStatusBadge';

export default function JobRequisitionCard({ requisition, onPress }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.header}>
        <View style={styles.titleArea}>
          <Text style={styles.title}>{requisition.title}</Text>
          <Text style={styles.metaText}>{requisition.departmentName} • {requisition.locationName}</Text>
        </View>
        <JobStatusBadge status={requisition.approvalStatus} />
      </View>

      <View style={styles.body}>
        <View style={styles.row}>
          <View style={styles.col}>
            <Text style={styles.label}>Hiring Manager</Text>
            <Text style={styles.value}>
              {requisition.hiringManager.firstName} {requisition.hiringManager.lastName}
            </Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Open Slots</Text>
            <Text style={styles.value}>{requisition.openPositions} Position{requisition.openPositions !== 1 ? 's' : ''}</Text>
          </View>
          <View style={styles.col}>
            <Text style={styles.label}>Priority</Text>
            <Text style={[styles.value, requisition.priority === 'HIGH' && styles.highPriority]}>
              {requisition.priority}
            </Text>
          </View>
        </View>

        <View style={styles.skillsSection}>
          <Text style={styles.label}>Skills Required</Text>
          <View style={styles.chipsContainer}>
            {requisition.requiredSkills.map((skill, idx) => (
              <Chip key={idx} style={styles.chip} textStyle={styles.chipText}>{skill}</Chip>
            ))}
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  titleArea: {
    flex: 1,
    marginRight: 8,
  },
  title: {
    fontSize: 15,
    fontWeight: '800',
    color: '#111827',
  },
  metaText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  body: {
    marginTop: 12,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  col: {
    flex: 1,
  },
  label: {
    fontSize: 10,
    fontWeight: '600',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 2,
  },
  value: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
  },
  highPriority: {
    color: '#DC2626',
    fontWeight: '700',
  },
  skillsSection: {
    marginTop: 4,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    backgroundColor: '#F3F4F6',
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chipText: {
    fontSize: 10,
    color: '#4B5563',
    marginVertical: 0,
    paddingHorizontal: 4,
  },
});
