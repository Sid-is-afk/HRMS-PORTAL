import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useMasterData } from '../hooks/useMasterData';
import { MasterDataCard } from '../components/MasterDataCard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { Searchbar } from 'react-native-paper';
import { Eye } from 'lucide-react-native';

export default function MasterDataDashboardScreen() {
  const navigation = useNavigation();
  const { categories, isLoading, error, selectCategory } = useMasterData();
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return categories;
    const q = searchQuery.toLowerCase();
    return categories.filter(
      (c) => c.name.toLowerCase().includes(q) || c.description.toLowerCase().includes(q)
    );
  }, [categories, searchQuery]);

  const stats = useMemo(() => {
    const totalCategories = categories.length;
    const readonlyCount = categories.filter((c) => c.isReadonly).length;
    const totalConfiguredValues = categories.reduce((sum, c) => sum + (c.count || 0), 0);

    return { totalCategories, readonlyCount, totalConfiguredValues };
  }, [categories]);

  const handleSelectCategory = (categoryId) => {
    selectCategory(categoryId);
    navigation.navigate('ReferenceValueList');
  };

  return (
    <AdminLayout title="Master Data Configuration">
      <View style={styles.container}>
        {/* Intro */}
        <View style={styles.header}>
          <View>
            <Text style={styles.title}>System Master Data & Centralized Config</Text>
            <Text style={styles.subtitle}>
              Configure corporate constants, leave parameters, and lists consumed globally across all business operations.
            </Text>
          </View>
        </View>

        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && categories.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.scroll}>
            {/* Stats Dashboard Grid */}
            <View style={styles.statsGrid}>
              <View style={[styles.statCard, { borderLeftColor: '#4F46E5' }]}>
                <Text style={styles.statLabel}>Config Categories</Text>
                <Text style={styles.statVal}>{stats.totalCategories}</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#10B981' }]}>
                <Text style={styles.statLabel}>Total References</Text>
                <Text style={styles.statVal}>{stats.totalConfiguredValues}</Text>
              </View>
              <View style={[styles.statCard, { borderLeftColor: '#0ea5e9' }]}>
                <Text style={styles.statLabel}>Organization Consumed</Text>
                <Text style={styles.statVal}>{stats.readonlyCount}</Text>
              </View>
            </View>

            {/* Quick Actions Panel */}
            <View style={styles.actionRow}>
              <Searchbar
                placeholder="Search categories..."
                value={searchQuery}
                onChangeText={setSearchQuery}
                style={styles.search}
                inputStyle={styles.searchInput}
              />
              <TouchableOpacity
                style={styles.globalSearchBtn}
                onPress={() => navigation.navigate('ConfigurationSearch')}
              >
                <Eye size={14} color="#FFFFFF" />
                <Text style={styles.globalSearchText}>Global Search</Text>
              </TouchableOpacity>
            </View>

            {/* Main Cards Grid */}
            <View style={styles.grid}>
              {filteredCategories.map((cat) => (
                <View key={cat.id} style={styles.gridItem}>
                  <MasterDataCard
                    category={cat}
                    onPress={() => handleSelectCategory(cat.id)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  scroll: {
    padding: 16,
  },
  statsGrid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    flexWrap: 'wrap',
  },
  statCard: {
    flex: 1,
    minWidth: 140,
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  statVal: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginTop: 6,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  search: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 6,
    height: 40,
    elevation: 0,
  },
  searchInput: {
    minHeight: 40,
    fontSize: 13,
  },
  globalSearchBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    height: 40,
    borderRadius: 6,
  },
  globalSearchText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 8,
    // On web size layouts, this wraps neatly
  },
});
