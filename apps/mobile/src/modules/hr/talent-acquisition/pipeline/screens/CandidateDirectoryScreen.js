import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert, ScrollView } from 'react-native';
import { Text, Button, TextInput, Portal, Modal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useCandidates } from '../hooks/useCandidates';
import CandidateCard from '../components/CandidateCard';
import CandidateFilterPanel from '../components/CandidateFilterPanel';
import CandidateSearchBar from '../components/CandidateSearchBar';
import { candidateProfileSchema } from '../validation/pipelineSchema';

export default function CandidateDirectoryScreen() {
  const navigation = useNavigation();
  const { candidates, filters, setFilters, resetFilters, createCandidate } = useCandidates();

  const [showFilters, setShowFilters] = useState(false);
  const [showCreateModal, setShowCreateModal] = useState(false);

  // Add Candidate Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [skills, setSkills] = useState('');
  const [expYears, setExpYears] = useState('');
  const [education, setEducation] = useState('');
  const [currentJobTitle, setCurrentJobTitle] = useState('Senior Software Engineer (React Native)');
  const [tagsText, setTagsText] = useState('');
  const [formError, setFormError] = useState('');

  const handleCreateCandidate = async () => {
    setFormError('');

    const skillsArray = skills.split(',').map(s => s.trim()).filter(Boolean);
    const tagsArray = tagsText.split(',').map(t => t.trim()).filter(Boolean);
    const parsedExp = parseFloat(expYears);

    const inputData = {
      firstName,
      lastName,
      email,
      phone,
      skills: skillsArray,
      experienceYears: isNaN(parsedExp) ? undefined : parsedExp,
      education,
      currentJobTitle,
      tags: tagsArray,
    };

    const validation = candidateProfileSchema.safeParse(inputData);
    if (!validation.success) {
      setFormError(validation.error.errors[0]?.message || 'Validation failed');
      return;
    }

    try {
      await createCandidate(validation.data);
      Alert.alert('Success', 'Candidate profile registered successfully.');
      setShowCreateModal(false);
      
      // Clear fields
      setFirstName('');
      setLastName('');
      setEmail('');
      setPhone('');
      setSkills('');
      setExpYears('');
      setEducation('');
      setTagsText('');
    } catch (err) {
      setFormError(err.message || 'Failed to register candidate.');
    }
  };

  const handleSelectCandidate = (candidateId) => {
    navigation.navigate('CandidateProfile', { candidateId });
  };

  return (
    <HRWorkspaceScreen title="Candidate Directory">
      <View style={styles.container}>
        <View style={styles.controlsRow}>
          <View style={styles.searchWrapper}>
            <CandidateSearchBar
              value={filters.search}
              onChangeText={(txt) => setFilters({ search: txt })}
              placeholder="Search by name or title..."
            />
          </View>
          <Button 
            mode="outlined" 
            textColor="#2563EB" 
            style={styles.filterBtn}
            onPress={() => setShowFilters(true)}
          >
            Filters
          </Button>
          <Button 
            mode="contained" 
            buttonColor="#2563EB"
            style={styles.createBtn}
            onPress={() => setShowCreateModal(true)}
          >
            Add Candidate
          </Button>
        </View>

        <CandidateFilterPanel
          visible={showFilters}
          filters={filters}
          onDismiss={() => setShowFilters(false)}
          onApply={setFilters}
          onReset={resetFilters}
        />

        <FlatList
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
          data={candidates}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <CandidateCard
              candidate={item}
              onPress={() => handleSelectCandidate(item.id)}
            />
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No candidates found.</Text>}
          contentContainerStyle={styles.listContainer}
        />

        <Portal>
          <Modal visible={showCreateModal} onDismiss={() => setShowCreateModal(false)} contentContainerStyle={styles.modal}>
            <ScrollView contentContainerStyle={styles.modalScroll} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalTitle}>Add New Candidate</Text>

              {formError ? (
                <View style={styles.errorBox}>
                  <Text style={styles.errorText}>{formError}</Text>
                </View>
              ) : null}

              <TextInput label="First Name" value={firstName} onChangeText={setFirstName} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
              <TextInput label="Last Name" value={lastName} onChangeText={setLastName} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
              <TextInput label="Email Address" value={email} onChangeText={setEmail} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" keyboardType="email-address" autoCapitalize="none" />
              <TextInput label="Phone Number" value={phone} onChangeText={setPhone} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" keyboardType="phone-pad" />
              
              <TextInput 
                label="Associated Vacancy/Job Title" 
                value={currentJobTitle} 
                onChangeText={setCurrentJobTitle} 
                mode="outlined" 
                style={styles.input} 
                activeOutlineColor="#2563EB" 
              />

              <TextInput label="Highest Education (e.g. B.Tech in CS)" value={education} onChangeText={setEducation} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
              <TextInput label="Experience Years" value={expYears} onChangeText={setExpYears} mode="outlined" style={styles.input} activeOutlineColor="#2563EB" keyboardType="numeric" />
              
              <TextInput label="Skills (comma separated)" value={skills} onChangeText={setSkills} placeholder="e.g. React Native, JavaScript, CSS" mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />
              <TextInput label="Tags (comma separated)" value={tagsText} onChangeText={setTagsText} placeholder="e.g. Frontend Specialist, Referral" mode="outlined" style={styles.input} activeOutlineColor="#2563EB" />

              <Button mode="contained" buttonColor="#2563EB" style={styles.submitBtn} onPress={handleCreateCandidate}>
                Add Candidate Profile
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
    backgroundColor: '#FFFFFF',
    padding: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
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
    paddingVertical: 32,
  },
  listContainer: {
    padding: 16,
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
