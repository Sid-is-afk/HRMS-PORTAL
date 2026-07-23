import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useReferenceValues } from '../hooks/useReferenceValues';
import { useMasterData } from '../hooks/useMasterData';
import { ImportPlaceholder } from '../components/ImportPlaceholder';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { ArrowLeft } from 'lucide-react-native';

export default function ImportPlaceholderScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { categoryId } = route.params || {};

  const { categories } = useMasterData();
  const { importValues, isLoading, error } = useReferenceValues();

  const activeCategory = useMemo(() => {
    return categories.find((c) => c.id === categoryId);
  }, [categories, categoryId]);

  const handleImportSubmit = async (jsonString) => {
    try {
      await importValues(jsonString);
      Alert.alert(
        'Import Successful',
        `Successfully imported bulk configurations into "${activeCategory?.name}".`
      );
      navigation.goBack();
    } catch (err) {
      Alert.alert('Import Failed', err.message || 'Error occurred during configuration upload.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <AdminLayout title="Import Reference Value Configurations">
      <View style={styles.container}>
        <View style={styles.backHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={handleCancel}>
            <ArrowLeft size={16} color="#4B5563" />
            <Text style={styles.backText}>Back to List</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.categoryInfo}>
              Target Category: <Text style={styles.categoryName}>{activeCategory?.name || 'Loading...'}</Text>
            </Text>

            {error ? <ErrorMessage message={error} style={styles.error} /> : null}

            <ImportPlaceholder
              onImport={handleImportSubmit}
              onCancel={handleCancel}
              isLoading={isLoading}
            />
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
  categoryInfo: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 16,
    fontWeight: '500',
  },
  categoryName: {
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  error: {
    marginBottom: 16,
  },
});
