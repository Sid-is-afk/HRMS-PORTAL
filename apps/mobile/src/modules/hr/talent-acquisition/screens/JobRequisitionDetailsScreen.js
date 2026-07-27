import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { Text, Card, Button, Portal, Modal, TextInput, Chip } from 'react-native-paper';
import { useRoute, useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useJobRequisitions } from '../hooks/useJobRequisitions';
import { useJobPostings } from '../hooks/useJobPostings';
import JobStatusBadge from '../components/JobStatusBadge';
import { jobPostingSchema } from '../validation/talentSchema';

export default function JobRequisitionDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { requisitionId } = route.params || {};

  const { setSelectedRequisitionId, selectedRequisition } = useJobRequisitions();
  const { publishPosting } = useJobPostings();

  // Set the selected ID in the store
  React.useEffect(() => {
    if (requisitionId) {
      setSelectedRequisitionId(requisitionId);
    }
  }, [requisitionId, setSelectedRequisitionId]);

  const [showPublishModal, setShowPublishModal] = useState(false);
  const [description, setDescription] = useState('');
  const [postingType, setPostingType] = useState('INTERNAL');
  const [formError, setFormError] = useState('');

  if (!selectedRequisition) {
    return (
      <HRWorkspaceScreen title="Requisition Details">
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Requisition not found.</Text>
        </View>
      </HRWorkspaceScreen>
    );
  }

  const handlePublish = async () => {
    setFormError('');

    const inputData = {
      requisitionId: selectedRequisition.id,
      title: selectedRequisition.title,
      description,
      type: postingType,
      status: 'PUBLISHED',
      visibility: 'PUBLIC',
    };

    // Zod Validation
    const validation = jobPostingSchema.safeParse(inputData);
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || 'Validation failed');
      return;
    }

    try {
      await publishPosting(selectedRequisition.id, validation.data);
      Alert.alert('Success', 'Job Posting published successfully.');
      setShowPublishModal(false);
      navigation.navigate('JobPostings');
    } catch (err) {
      setFormError(err.message || 'Failed to publish posting');
    }
  };

  const handleArchiveRequisition = () => {
    Alert.alert('Archive Requisition', 'Archiving job requisition...');
  };

  return (
    <HRWorkspaceScreen title="Requisition Details">
      <ScrollView contentContainerStyle={styles.container}>
        <Card style={styles.card}>
          <Card.Content>
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{selectedRequisition.title}</Text>
                <Text style={styles.meta}>{selectedRequisition.departmentName} • {selectedRequisition.locationName}</Text>
              </View>
              <JobStatusBadge status={selectedRequisition.approvalStatus} />
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Overview</Text>
              <View style={styles.grid}>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Hiring Manager</Text>
                  <Text style={styles.value}>
                    {selectedRequisition.hiringManager.firstName} {selectedRequisition.hiringManager.lastName}
                  </Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Employment Type</Text>
                  <Text style={styles.value}>{selectedRequisition.employmentType}</Text>
                </View>
              </View>

              <View style={styles.grid}>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Open Slots</Text>
                  <Text style={styles.value}>{selectedRequisition.openPositions} Position(s)</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Priority Level</Text>
                  <Text style={[styles.value, selectedRequisition.priority === 'HIGH' && styles.highPriority]}>
                    {selectedRequisition.priority}
                  </Text>
                </View>
              </View>

              <View style={styles.grid}>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Experience Range</Text>
                  <Text style={styles.value}>{selectedRequisition.experienceMin} to {selectedRequisition.experienceMax} years</Text>
                </View>
                <View style={styles.gridCol}>
                  <Text style={styles.label}>Salary Range (Est.)</Text>
                  <Text style={styles.value}>
                    {selectedRequisition.salaryMin ? `${selectedRequisition.salaryMin} - ${selectedRequisition.salaryMax}` : 'Confidential'}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Required Skills</Text>
              <View style={styles.chipsRow}>
                {selectedRequisition.requiredSkills.map((skill, idx) => (
                  <Chip key={idx} style={styles.chip}>{skill}</Chip>
                ))}
              </View>
            </View>

            <View style={styles.actions}>
              {selectedRequisition.approvalStatus === 'APPROVED' && (
                <Button 
                  mode="contained" 
                  buttonColor="#2563EB"
                  style={styles.actionBtn}
                  onPress={() => setShowPublishModal(true)}
                >
                  Publish to Job Board
                </Button>
              )}
              <Button 
                mode="outlined" 
                textColor="#DC2626" 
                style={styles.archiveBtn}
                onPress={handleArchiveRequisition}
              >
                Archive Requisition
              </Button>
            </View>
          </Card.Content>
        </Card>

        <Portal>
          <Modal visible={showPublishModal} onDismiss={() => setShowPublishModal(false)} contentContainerStyle={styles.modal}>
            <Text style={styles.modalTitle}>Publish Job Opportunity</Text>
            {formError ? (
              <View style={styles.errorBox}>
                <Text style={styles.errorBoxText}>{formError}</Text>
              </View>
            ) : null}

            <TextInput
              label="Job Description"
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              mode="outlined"
              style={styles.input}
              activeOutlineColor="#2563EB"
            />

            <Text style={styles.label}>Posting Channels</Text>
            <View style={styles.chipsRow}>
              {['INTERNAL', 'EXTERNAL'].map(t => (
                <Chip key={t} selected={postingType === t} onPress={() => setPostingType(t)} selectedColor="#2563EB">{t}</Chip>
              ))}
            </View>

            <Button mode="contained" buttonColor="#2563EB" style={styles.submitBtn} onPress={handlePublish}>
              Confirm & Publish
            </Button>
          </Modal>
        </Portal>
      </ScrollView>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingBottom: 20,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 16,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: '#111827',
  },
  meta: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#9CA3AF',
    textTransform: 'uppercase',
    marginBottom: 10,
    letterSpacing: 0.5,
  },
  grid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  gridCol: {
    flex: 1,
  },
  label: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 2,
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  highPriority: {
    color: '#DC2626',
    fontWeight: '700',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#F3F4F6',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
    marginTop: 10,
  },
  actionBtn: {
    borderRadius: 8,
  },
  archiveBtn: {
    borderColor: '#DC2626',
    borderRadius: 8,
  },
  errorContainer: {
    padding: 32,
    alignItems: 'center',
  },
  errorText: {
    fontSize: 14,
    color: '#DC2626',
    fontWeight: '600',
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
    marginBottom: 16,
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
    marginBottom: 16,
  },
  errorBoxText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
});
