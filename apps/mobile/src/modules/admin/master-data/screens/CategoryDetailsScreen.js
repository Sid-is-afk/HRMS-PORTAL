import React, { useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useMasterData } from '../hooks/useMasterData';
import { useReferenceValues } from '../hooks/useReferenceValues';
import { useConfigurationFilters } from '../hooks/useConfigurationFilters';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { ConfigurationHeader } from '../components/ConfigurationHeader';
import { ReferenceTable } from '../components/ReferenceTable';
import { ReferenceSearchBar } from '../components/ReferenceSearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ArrowLeft, Plus } from 'lucide-react-native';

export default function CategoryDetailsScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params || {};

  const { categories, selectCategory } = useMasterData();
  const {
    referenceValues,
    isLoading,
    error,
    archiveReferenceValue,
  } = useReferenceValues();

  const { searchQuery, search } = useReferenceSearch();
  const { filters, setFilters } = useConfigurationFilters();

  useEffect(() => {
    if (categoryId) {
      selectCategory(categoryId);
    }
  }, [categoryId, selectCategory]);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId);
  }, [categories, categoryId]);

  const handleEdit = (item) => {
    navigation.navigate('ReferenceValueForm', { isEdit: true, valueId: item.id });
  };

  const handleArchive = (item) => {
    Alert.alert(
      'Archive Reference Value',
      `Are you sure you want to archive the reference value "${item.name}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Archive',
          style: 'destructive',
          onPress: async () => {
            try {
              await archiveReferenceValue(item.id);
              Alert.alert('Success', 'Reference value has been archived.');
            } catch (err) {
              Alert.alert('Error', err.message || 'Archiving failed.');
            }
          },
        },
      ]
    );
  };

  const handleExport = () => {
    navigation.navigate('ExportPlaceholder', { categoryId });
  };

  const handleImport = () => {
    navigation.navigate('ImportPlaceholder', { categoryId });
  };

  return (
    <AdminLayout title="Category Configuration">
      <View style={styles.container}>
        <View style={styles.backHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={16} color="#4B5563" />
            <Text style={styles.backText}>Back to Dashboard</Text>
          </TouchableOpacity>
        </View>

        {activeCategory ? (
          <ScrollView contentContainerStyle={styles.scroll}>
            <ConfigurationHeader
              category={activeCategory}
              onImport={handleImport}
              onExport={handleExport}
            />

            {/* Actions Bar */}
            <View style={styles.actionBar}>
              <View style={styles.searchWrapper}>
                <ReferenceSearchBar
                  query={searchQuery}
                  onSearch={search}
                  sortBy={filters.sortBy}
                  sortOrder={filters.sortOrder}
                  onSortChange={setFilters}
                />
              </View>
              {!activeCategory.isReadonly && (
                <TouchableOpacity
                  style={styles.addBtn}
                  onPress={() => navigation.navigate('ReferenceValueForm', { isEdit: false })}
                >
                  <Plus size={14} color="#FFFFFF" />
                  <Text style={styles.addBtnText}>Add Reference Value</Text>
                </TouchableOpacity>
              )}
            </View>

            <FilterPanel
              currentStatus={filters.status}
              onStatusSelect={(status) => setFilters({ status })}
            />

            {error ? <ErrorMessage message={error} /> : null}

            {isLoading && referenceValues.length === 0 ? (
              <SkeletonDashboard />
            ) : (
              <ReferenceTable
                values={referenceValues}
                isReadonly={activeCategory.isReadonly}
                onEdit={handleEdit}
                onArchive={handleArchive}
              />
            )}
          </ScrollView>
        ) : (
          <SkeletonDashboard />
        )}
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
  },
  actionBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  searchWrapper: {
    flex: 1,
    minWidth: 280,
  },
  addBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    borderRadius: 6,
    height: 40,
  },
  addBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
