import React, { useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useReferenceValues } from '../hooks/useReferenceValues';
import { useMasterData } from '../hooks/useMasterData';
import { ReferenceValueEditor } from '../components/ReferenceValueEditor';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { ArrowLeft } from 'lucide-react-native';

export default function ReferenceValueFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { isEdit, valueId } = route.params || {};

  const { categories, selectedCategoryId } = useMasterData();
  const {
    getReferenceValueById,
    createReferenceValue,
    updateReferenceValue,
    isLoading,
    error,
  } = useReferenceValues();

  const activeCategory = useMemo(() => {
    return categories.find(c => c.id === selectedCategoryId);
  }, [categories, selectedCategoryId]);

  const initialValues = useMemo(() => {
    if (isEdit && valueId) {
      return getReferenceValueById(valueId);
    }
    return null;
  }, [isEdit, valueId, getReferenceValueById]);

  const handleSubmit = async (data) => {
    try {
      if (isEdit && valueId) {
        await updateReferenceValue(valueId, data);
        Alert.alert('Success', 'Reference value updated successfully.');
      } else {
        await createReferenceValue(data);
        Alert.alert('Success', 'Reference value created successfully.');
      }
      navigation.goBack();
    } catch (err) {
      Alert.alert('Submission Failed', err.message || 'Operation failed.');
    }
  };

  const handleCancel = () => {
    navigation.goBack();
  };

  return (
    <AdminLayout title={isEdit ? 'Edit Reference Value' : 'Add Reference Value'}>
      <View style={styles.container}>
        {/* Back Link */}
        <View style={styles.backHeader}>
          <TouchableOpacity style={styles.backBtn} onPress={handleCancel}>
            <ArrowLeft size={16} color="#4B5563" />
            <Text style={styles.backText}>Back to List</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.scroll}>
          <View style={styles.card}>
            <Text style={styles.formTitle}>
              {isEdit ? 'Update Reference Parameter' : 'Create New Reference Parameter'}
            </Text>
            <Text style={styles.formSubtitle}>
              Configuring value for category: <Text style={styles.categoryName}>{activeCategory?.name || 'Loading...'}</Text>
            </Text>

            {error ? <ErrorMessage message={error} style={styles.error} /> : null}

            <ReferenceValueEditor
              initialValues={initialValues}
              onSubmit={handleSubmit}
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  formSubtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
    marginBottom: 20,
  },
  categoryName: {
    fontWeight: 'bold',
    color: '#4F46E5',
  },
  error: {
    marginBottom: 16,
  },
});
