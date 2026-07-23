import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { RadioButton, Button } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { useConfigurationFilters } from '../hooks/useConfigurationFilters';
import { ArrowLeft, RefreshCw } from 'lucide-react-native';

export default function ConfigurationFiltersScreen() {
  const navigation = useNavigation();
  const { filters, setFilters, resetFilters } = useConfigurationFilters();

  const handleApply = () => {
    navigation.goBack();
  };

  return (
    <AdminLayout title="Configuration Filters & Sorting Rules">
      <View style={styles.container}>
        <View style={styles.backHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={16} color="#4B5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardTitle}>Filter Rules Configuration</Text>
              <TouchableOpacity onPress={resetFilters} style={styles.resetBtn}>
                <RefreshCw size={12} color="#4F46E5" />
                <Text style={styles.resetText}>Reset All</Text>
              </TouchableOpacity>
            </View>

            {/* Filter by Status */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Reference Value Status</Text>
              <RadioButton.Group
                onValueChange={(value) => setFilters({ status: value })}
                value={filters.status}
              >
                <View style={styles.radioRow}>
                  <RadioButton value="all" color="#4F46E5" />
                  <Text style={styles.radioLabel}>All Statuses (Active, Inactive, Archived)</Text>
                </View>
                <View style={styles.radioRow}>
                  <RadioButton value="ACTIVE" color="#4F46E5" />
                  <Text style={styles.radioLabel}>Active only</Text>
                </View>
                <View style={styles.radioRow}>
                  <RadioButton value="INACTIVE" color="#4F46E5" />
                  <Text style={styles.radioLabel}>Inactive only</Text>
                </View>
                <View style={styles.radioRow}>
                  <RadioButton value="ARCHIVED" color="#4F46E5" />
                  <Text style={styles.radioLabel}>Archived only</Text>
                </View>
              </RadioButton.Group>
            </View>

            {/* Sort Field */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort Field</Text>
              <RadioButton.Group
                onValueChange={(value) => setFilters({ sortBy: value })}
                value={filters.sortBy}
              >
                <View style={styles.radioRow}>
                  <RadioButton value="name" color="#4F46E5" />
                  <Text style={styles.radioLabel}>Display Name</Text>
                </View>
                <View style={styles.radioRow}>
                  <RadioButton value="code" color="#4F46E5" />
                  <Text style={styles.radioLabel}>System Code</Text>
                </View>
              </RadioButton.Group>
            </View>

            {/* Sort Order */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Sort Direction</Text>
              <RadioButton.Group
                onValueChange={(value) => setFilters({ sortOrder: value })}
                value={filters.sortOrder}
              >
                <View style={styles.radioRow}>
                  <RadioButton value="asc" color="#4F46E5" />
                  <Text style={styles.radioLabel}>Ascending (A-Z, 0-9)</Text>
                </View>
                <View style={styles.radioRow}>
                  <RadioButton value="desc" color="#4F46E5" />
                  <Text style={styles.radioLabel}>Descending (Z-A, 9-0)</Text>
                </View>
              </RadioButton.Group>
            </View>

            <Button mode="contained" onPress={handleApply} style={styles.applyBtn}>
              Apply Configurations
            </Button>
          </View>
        </ScrollView>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backHeader: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    backgroundColor: '#FFFFFF',
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  backText: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
  scroll: {
    padding: 16,
    alignItems: 'center',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 20,
    width: '100%',
    maxWidth: 560,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  resetBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  resetText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '600',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  radioRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  radioLabel: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
  },
  applyBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 6,
    marginTop: 10,
  },
});
