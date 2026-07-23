import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useReferenceValues } from '../hooks/useReferenceValues';
import { useMasterData } from '../hooks/useMasterData';
import { ExportPlaceholder } from '../components/ExportPlaceholder';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ArrowLeft } from 'lucide-react-native';

export default function ExportPlaceholderScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params || {};

  const { categories, selectCategory } = useMasterData();
  const { exportValues, error } = useReferenceValues();

  const [jsonText, setJsonText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId);
  }, [categories, categoryId]);

  useEffect(() => {
    const fetchExportData = async () => {
      setIsLoading(true);
      try {
        if (categoryId) {
          selectCategory(categoryId);
          const data = await exportValues();
          setJsonText(data);
        }
      } catch {
        // Handled by local error state if needed
      } finally {
        setIsLoading(false);
      }
    };
    fetchExportData();
  }, [categoryId, exportValues, selectCategory]);

  const handleDismiss = () => {
    navigation.goBack();
  };

  return (
    <AdminLayout title="Export Configurations">
      <View style={styles.container}>
        <View style={styles.backHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={handleDismiss}>
            <ArrowLeft size={16} color="#4B5563" />
            <Text style={styles.backText}>Back to List</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            {error ? <ErrorMessage message={error} style={styles.error} /> : null}

            {isLoading ? (
              <SkeletonDashboard />
            ) : (
              <ExportPlaceholder
                jsonContent={jsonText}
                categoryName={activeCategory?.name || 'Loading Category...'}
                onDismiss={handleDismiss}
              />
            )}
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
    maxWidth: 600,
  },
  error: {
    marginBottom: 16,
  },
});
