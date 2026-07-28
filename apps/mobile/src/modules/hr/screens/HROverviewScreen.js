import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Button, Avatar } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from './HRWorkspaceScreen';

const overviewModules = [
  { id: 'rec', title: 'Recruitment Management', description: 'Pipeline overview, interview tracking, and job postings.', icon: 'briefcase-search-outline', status: 'Active (Sprint 3)' },
  { id: 'onb', title: 'Employee Onboarding', description: 'New hire checklists, document validation, and confirmation tasks.', icon: 'account-child-circle', status: 'Placeholder (Sprint 2)' },
  { id: 'perf', title: 'Performance Reviews', description: 'Appraisals cycle setup, self evaluations, and goals management.', icon: 'chart-gantt', status: 'Placeholder (Sprint 2)' },
  { id: 'train', title: 'Training & Development', description: 'Course enrollments, policy compliance, and certificates.', icon: 'school-outline', status: 'Placeholder (Sprint 2)' },
  { id: 'doc', title: 'Document Center', description: 'Employee folders, visa/work authorizations, and contract repository.', icon: 'folder-google-drive', status: 'Placeholder (Sprint 2)' },
];

export default function HROverviewScreen() {
  const navigation = useNavigation();

  const handleLaunchModule = (mod) => {
    if (mod.id === 'rec') {
      navigation.navigate('TalentDashboard');
    } else {
      console.log('Module Offline', `${mod.title} will be fully activated in Sprint 2.`);
    }
  };

  return (
    <HRWorkspaceScreen title="HR Domain Overview">
      <View style={styles.container}>
        <Text style={styles.intro}>
          Welcome to the HR Enterprise workspace. The modules below represent core functional domains of our talent management suite.
        </Text>
        <View style={styles.grid}>
          {overviewModules.map((mod) => (
            <Card key={mod.id} style={styles.card}>
              <Card.Title
                title={mod.title}
                subtitle={mod.status}
                left={(props) => <Avatar.Icon {...props} icon={mod.icon} />}
              />
              <Card.Content>
                <Text style={styles.desc}>{mod.description}</Text>
              </Card.Content>
              <Card.Actions>
                <Button 
                  mode="outlined" 
                  textColor="#2563EB" 
                  style={styles.btn} 
                  onPress={() => handleLaunchModule(mod)}
                >
                  Configure
                </Button>
              </Card.Actions>
            </Card>
          ))}
        </View>
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  intro: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 20,
    lineHeight: 20,
  },
  grid: {
    flexDirection: 'column',
    gap: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
  },
  desc: {
    fontSize: 13,
    color: '#4B5563',
    lineHeight: 18,
    marginTop: 8,
  },
  btn: {
    borderColor: '#2563EB',
  },
});
