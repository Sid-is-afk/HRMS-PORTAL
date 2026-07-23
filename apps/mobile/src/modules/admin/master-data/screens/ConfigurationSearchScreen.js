import React, { useState, useMemo, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Searchbar } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { useMasterData } from '../hooks/useMasterData';
import { masterDataService } from '../services/masterDataService';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ArrowLeft, ChevronRight, Tag } from 'lucide-react-native';

export default function ConfigurationSearchScreen() {
  const navigation = useNavigation();
  const { categories, selectCategory } = useMasterData();

  const [query, setQuery] = useState('');
  const [allValues, setAllValues] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Load all values across non-readonly categories for local search
  useEffect(() => {
    const loadAllReferenceData = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const promises = categories.map(async (cat) => {
          const vals = await masterDataService.getReferenceValues(cat.id);
          return vals.map((v) => ({
            ...v,
            categoryName: cat.name,
            categoryId: cat.id,
          }));
        });
        const results = await Promise.all(promises);
        setAllValues(results.flat());
      } catch (err) {
        setError(err.message || 'Failed to populate search index.');
      } finally {
        setIsLoading(false);
      }
    };

    if (categories.length > 0) {
      loadAllReferenceData();
    }
  }, [categories]);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return allValues.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q) ||
        (item.description && item.description.toLowerCase().includes(q))
    );
  }, [allValues, query]);

  const handleSelectResult = (categoryId) => {
    selectCategory(categoryId);
    navigation.navigate('ReferenceValueList');
  };

  return (
    <AdminLayout title="Global Configuration Search">
      <View style={styles.container}>
        <View style={styles.backHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <ArrowLeft size={16} color="#4B5563" />
            <Text style={styles.backText}>Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.searchBox}>
          <Searchbar
            placeholder="Search code, name, description across all categories..."
            value={query}
            onChangeText={setQuery}
            style={styles.search}
            inputStyle={styles.searchInput}
          />
        </View>

        {error ? <ErrorMessage message={error} /> : null}

        {isLoading ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {!query.trim() ? (
              <View style={styles.empty}>
                <Tag size={32} color="#9CA3AF" style={styles.emptyIcon} />
                <Text style={styles.emptyText}>Enter a search term to scan all reference lists.</Text>
              </View>
            ) : searchResults.length === 0 ? (
              <View style={styles.empty}>
                <Text style={styles.emptyText}>No matching configuration values found.</Text>
              </View>
            ) : (
              searchResults.map((item) => (
                <TouchableOpacity
                  key={`${item.categoryId}-${item.id}`}
                  style={styles.card}
                  onPress={() => handleSelectResult(item.categoryId)}
                >
                  <View style={styles.cardBody}>
                    <View style={styles.titleRow}>
                      <Text style={styles.name}>{item.name}</Text>
                      <Text style={styles.code}>{item.code}</Text>
                    </View>
                    <Text style={styles.desc} numberOfLines={2}>
                      {item.description || 'No description provided.'}
                    </Text>
                    <View style={styles.categoryInfo}>
                      <Text style={styles.categoryLabel}>Category:</Text>
                      <Text style={styles.categoryName}>{item.categoryName}</Text>
                    </View>
                  </View>
                  <ChevronRight size={16} color="#9CA3AF" />
                </TouchableOpacity>
              ))
            )}
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
  searchBox: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  search: {
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
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 14,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  cardBody: {
    flex: 1,
    paddingRight: 16,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  name: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#111827',
  },
  code: {
    fontFamily: 'monospace',
    fontSize: 11,
    color: '#4B5563',
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  desc: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 6,
    lineHeight: 16,
  },
  categoryInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 8,
  },
  categoryLabel: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  categoryName: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4F46E5',
  },
  empty: {
    padding: 48,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyIcon: {
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 13,
    color: '#6B7280',
    textAlign: 'center',
  },
});
