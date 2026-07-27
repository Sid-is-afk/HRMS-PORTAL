import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import HRWorkspaceScreen from '@/modules/hr/screens/HRWorkspaceScreen';
import { useRecruitmentFilters } from '../hooks/useRecruitmentFilters';
import RecruitmentFilterPanel from '../components/RecruitmentFilterPanel';

export default function RecruitmentFiltersScreen() {
  const navigation = useNavigation();
  const { filters, setFilters, resetFilters } = useRecruitmentFilters();

  const handleApply = () => {
    navigation.goBack();
  };

  return (
    <HRWorkspaceScreen title="Recruitment Filters">
      <View style={styles.container}>
        <RecruitmentFilterPanel
          filters={filters}
          onFilterChange={setFilters}
          onReset={resetFilters}
        />
        <Button mode="contained" buttonColor="#2563EB" style={styles.btn} onPress={handleApply}>
          Apply Filters
        </Button>
      </View>
    </HRWorkspaceScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btn: {
    marginTop: 16,
    borderRadius: 8,
    height: 44,
    justifyContent: 'center',
  },
});
