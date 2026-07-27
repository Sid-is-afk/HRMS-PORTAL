import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Button, TextInput, Portal, Modal, Chip } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useJobRequisitions } from '../hooks/useJobRequisitions';
import { useRecruitmentFilters } from '../hooks/useRecruitmentFilters';
import JobRequisitionCard from '../components/JobRequisitionCard';
import RecruitmentFilterPanel from '../components/RecruitmentFilterPanel';
import RecruitmentSearchBar from '../components/RecruitmentSearchBar';
import DepartmentSelector from '../components/DepartmentSelector';
import HiringManagerSelector from '../components/HiringManagerSelector';
import { jobRequisitionSchema } from '../validation/talentSchema';

export default function JobRequisitionDirectoryScreen() {
  const navigation = useNavigation();
  const { jobRequisitions, createRequisition } = useJobRequisitions();
  const { filters, setFilters, resetFilters } = useRecruitmentFilters();
  
  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [departmentId, setDepartmentId] = useState('dept-eng');
  const [hiringManagerId, setHiringManagerId] = useState('emp-mgr1');
  const [employmentType, setEmploymentType] = useState('FULL_TIME');
  const [locationId, setLocationId] = useState('loc-hq');
  const [priority, setPriority] = useState('HIGH');
  const [openPositions, setOpenPositions] = useState('1');
  const [skills, setSkills] = useState('');
  const [expMin, setExpMin] = useState('2');
  const [expMax, setExpMax] = useState('5');
  const [salaryMin, setSalaryMin] = useState('500000');
  const [salaryMax, setSalaryMax] = useState('1000000');
  const [formError, setFormError] = useState('');

  const handleCreate = async () => {
    setFormError('');
    
    // Prepare input data
    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const parsedOpenPositions = parseInt(openPositions, 10);
    const parsedExpMin = parseInt(expMin, 10);
    const parsedExpMax = parseInt(expMax, 10);
    const parsedSalaryMin = parseInt(salaryMin, 10);
    const parsedSalaryMax = parseInt(salaryMax, 10);

    const inputData = {
      title,
      departmentId,
      hiringManagerId,
      employmentType,
      locationId,
      priority,
      openPositions: isNaN(parsedOpenPositions) ? undefined : parsedOpenPositions,
      requiredSkills: skillsArray,
      experienceMin: isNaN(parsedExpMin) ? undefined : parsedExpMin,
      experienceMax: isNaN(parsedExpMax) ? undefined : parsedExpMax,
      salaryMin: isNaN(parsedSalaryMin) ? undefined : parsedSalaryMin,
      salaryMax: isNaN(parsedSalaryMax) ? undefined : parsedSalaryMax,
    };

    // Zod Validation
    const validation = jobRequisitionSchema.safeParse(inputData);
    if (!validation.success) {
      const err = validation.error.errors[0]?.message || 'Validation error';
      setFormError(err);
      return;
    }

    try {
      await createRequisition(validation.data);
      Alert.alert('Success', 'Job Requisition raised successfully.');
      setShowCreateModal(false);
      // Reset form fields
      setTitle('');
      setSkills('');
    } catch (err) {
      setFormError(err.message || 'Failed to create requisition');
    }
  };

  const handleSelectRequisition = (id) => {
    navigation.navigate('JobRequisitionDetails', { requisitionId: id });
  };

  return (
    <HRWorkspaceScreen title="Job Requisitions Directory">
      <View style={styles.container}>
        <View style={styles.controlsRow}>
          <View style={styles.searchWrapper}>
            <RecruitmentSearchBar
              value={filters.search}
              onChangeText={(txt) => setFilters({ search: txt })}
              placeholder="Search by Job title..."
            />
          </View>
          <Button 
            mode="outlined" 
            textColor="#2563EB" 
            style={styles.filterBtn}
            onPress={() => setShowFilters(!showFilters)}
          >
            {showFilters ? 'Hide Filters' : 'Filters'}
          </Button>
          <Button 
            mode="contained" 
            buttonColor="#2563EB"
            style={styles.createBtn}
            onPress={() => setShowCreateModal(true)}
          >
            Raise Requisition
          </Button>
        </View>

        {showFilters && (
          <RecruitmentFilterPanel
            filters={filters}
            onFilterChange={setFilters}
            onReset={resetFilters}
          />
        )}

        <FlatList\n        initialNumToRender={10}\n        maxToRenderPerBatch={10}\n        windowSize={5}
          data={jobRequisitions}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <JobRequisitionCard
              requisition={item}
              onPress={() => handleSelectRequisition(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No job requisitions found matching filters.</Text>}
        />

        <Portal>
          <Modal visible={showCreateModal} onDismiss={() => setShowCreateModal(false)} contentContainerStyle={styles.modal}>
            <ScrollView contentContainerStyle={styles.modalScroll}>
              <Text style={styles.modalTitle}>Raise Job Requisition</Text>
              
              {formError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

              <TextInput label="Job Title" value={title} onChangeText={setTitle} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
              <DepartmentSelector selectedId={departmentId} onSelect={setDepartmentId} />
              <HiringManagerSelector selectedId={hiringManagerId} onSelect={setHiringManagerId} />
              
              <Text style={styles.sectionLabel}>Location</Text>
              <View style={styles.chipRow}>
                {[{id: 'loc-hq', label: 'HQ'}, {id: 'loc-hybrid', label: 'Hybrid/London'}].map(l => (
                  <Chip key={l.id} selected={locationId === l.id} onPress={() => setLocationId(l.id)} selectedColor="#2563EB" style={styles.chip}>{l.label}</Chip>
                ))}
              </View>

              <TextInput label="Skills Required (comma separated)" value={skills} onChangeText={setSkills} placeholder="React Native, Zod, State Management" mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
              
              <Text style={styles.sectionLabel}>Priority</Text>
              <View style={styles.chipRow}>
                {['LOW', 'MEDIUM', 'HIGH'].map(p => (
                  <Chip key={p} selected={priority === p} onPress={() => setPriority(p)} selectedColor="#2563EB" style={styles.chip}>{p}</Chip>
                ))}
              </View>

              <Text style={styles.sectionLabel}>Employment Type</Text>
              <View style={styles.chipRow}>
                {['FULL_TIME', 'PART_TIME', 'CONTRACT', 'INTERN'].map(t => (
                  <Chip key={t} selected={employmentType === t} onPress={() => setEmploymentType(t)} selectedColor="#2563EB" style={styles.chip}>{t}</Chip>
                ))}
              </View>

              <View style={styles.row}>
                <TextInput label="Open Positions" value={openPositions} onChangeText={setOpenPositions} keyboardType="numeric" mode="outlined" style={[styles.input, styles.half]} activeOutlineColor="#2563EB" />
                <TextInput label="Min Experience (yrs)" value={expMin} onChangeText={setExpMin} keyboardType="numeric" mode="outlined" style={[styles.input, styles.half]} activeOutlineColor="#2563EB" />
              </View>

              <View style={styles.row}>
                <TextInput label="Max Experience (yrs)" value={expMax} onChangeText={setExpMax} keyboardType="numeric" mode="outlined" style={[styles.input, styles.half]} activeOutlineColor="#2563EB" />
                <TextInput label="Min Salary" value={salaryMin} onChangeText={setSalaryMin} keyboardType="numeric" mode="outlined" style={[styles.input, styles.half]} activeOutlineColor="#2563EB" />
              </View>

              <View style={styles.row}>
                <TextInput label="Max Salary" value={salaryMax} onChangeText={setSalaryMax} keyboardType="numeric" mode="outlined" style={[styles.input, styles.half]} activeOutlineColor="#2563EB" />
              </View>

              <Button mode="contained" buttonColor="#2563EB" style={styles.submitBtn} onPress={handleCreate}>
                Submit for Approval
              </Button>
            </ScrollView>
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
  controlsRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginBottom: 10,
  },
  searchWrapper: {
    flex: 1,
  },
  filterBtn: {
    borderColor: '#2563EB',
    height: 40,
    justifyContent: 'center',
  },
  createBtn: {
    height: 40,
    justifyContent: 'center',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
    textAlign: 'center',
    paddingVertical: 20,
  },
  modal: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 12,
    maxHeight: '90%',
  },
  modalScroll: {
    paddingBottom: 20,
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
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  half: {
    flex: 1,
  },
  sectionLabel: {
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
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    fontWeight: '600',
  },
});
