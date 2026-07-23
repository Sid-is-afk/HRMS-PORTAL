import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useMasterData } from '../hooks/useMasterData';
import { useReferenceValues } from '../hooks/useReferenceValues';
import { useConfigurationFilters } from '../hooks/useConfigurationFilters';
import { useReferenceSearch } from '../hooks/useReferenceSearch';
import { ConfigurationSidebar } from '../components/ConfigurationSidebar';
import { ConfigurationHeader } from '../components/ConfigurationHeader';
import { ReferenceTable } from '../components/ReferenceTable';
import { ReferenceSearchBar } from '../components/ReferenceSearchBar';
import { FilterPanel } from '../components/FilterPanel';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { Plus, Settings } from 'lucide-react-native';

export default function ReferenceValueListScreen() {
  const navigation = useNavigation();
  const { categories, selectedCategoryId, selectCategory, isLoading: catsLoading } = useMasterData();
  const {
    referenceValues,
    isLoading: valsLoading,
    error,
    archiveReferenceValue,
  } = useReferenceValues();

  const { searchQuery, search } = useReferenceSearch();
  const { filters, setFilters } = useConfigurationFilters();

  const activeCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

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
    navigation.navigate('ExportPlaceholder', { categoryId: selectedCategoryId });
  };

  const handleImport = () => {
    navigation.navigate('ImportPlaceholder', { categoryId: selectedCategoryId });
  };

  const isLoading = catsLoading || valsLoading;

  return (
    <AdminLayout title="Master Data Configuration">
      <View style={styles.container}>
        {/* Sidebar Left */}
        <View style={styles.sidebarWrapper}>
          <ConfigurationSidebar
            categories={categories}
            selectedId={selectedCategoryId}
            onSelect={selectCategory}
          />
        </View>

        {/* Content Right */}
        <View style={styles.contentWrapper}>
          {activeCategory ? (
            <ScrollView contentContainerStyle={styles.scroll}>
              <ConfigurationHeader
                category={activeCategory}
                onImport={handleImport}
                onExport={handleExport}
              />

              {/* Actions Row */}
              <View style={styles.actionsBar}>
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
                    <Text style={styles.addBtnText}>Add Value</Text>
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
            <View style={styles.empty}>
              <Settings size={32} color="#9CA3AF" style={styles.emptyIcon} />
              <Text style={styles.emptyText}>Select a category from the sidebar to manage reference parameters.</Text>
            </View>
          )}
        </View>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#F9FAFB',
  },
  sidebarWrapper: {
    padding: 16,
    borderRightWidth: 1,
    borderRightColor: '#E5E7EB',
    backgroundColor: '#FFFFFF',
  },
  contentWrapper: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scroll: {
    padding: 16,
  },
  actionsBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  searchWrapper: {
    flex: 1,
    minWidth: 240,
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
  empty: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
    maxWidth: 320,
    lineHeight: 18,
  },
});
