import React, { useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Button, Text, Chip } from 'react-native-paper';
import AdminLayout from '../../components/AdminLayout';
import { designationSchema } from '../validation/orgSchema';
import { useDesignations } from '../hooks/useDesignations';
import { useOrganization } from '../hooks/useOrganization';
import { TextInput } from '@/shared/components/TextInput';
import SkeletonDashboard from '../../components/SkeletonDashboard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function DesignationFormScreen() {
  const route = useRoute();
  const navigation = useNavigation();
  const { id } = route.params || {};

  const isEditMode = !!id;
  const { designation, isLoading: isFetching, departments } = useDesignations(id);
  const { saveDesignation, isLoading: isSaving, error } = useOrganization();

  const defaultValues = {
    title: '',
    level: '1',
    description: '',
    departmentId: '',
    status: 'ACTIVE',
  };

  const { control, handleSubmit, reset, formState: { errors } } = useForm({
    resolver: zodResolver(designationSchema),
    defaultValues,
  });

  useEffect(() => {
    if (isEditMode && designation) {
      reset({
        title: designation.title,
        level: String(designation.level),
        description: designation.description || '',
        departmentId: designation.departmentId || '',
        status: designation.status || 'ACTIVE',
      });
    }
  }, [isEditMode, designation, reset]);

  const onSubmit = async (values) => {
    try {
      await saveDesignation(id, values);
      navigation.navigate('AdminDesignationDirectory');
    } catch {
      // Handled in store
    }
  };

  if (isFetching && !designation) {
    return (
      <AdminLayout title={isEditMode ? 'Edit Designation' : 'Add Designation'}>
        <SkeletonDashboard />
      </AdminLayout>
    );
  }

  const statuses = [
    { id: 'ACTIVE', label: 'Active' },
    { id: 'ARCHIVED', label: 'Archived' },
  ];

  return (
    <AdminLayout title={isEditMode ? 'Edit Designation' : 'Add Designation'}>
      <ScrollView contentContainerStyle={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <Controller
          control={control}
          name="title"
          render={({ field: { onChange, value } }) => (
            <TextInput label="Designation Title" value={value} onChangeText={onChange} error={errors.title?.message} />
          )}
        />

        <Controller
          control={control}
          name="level"
          render={({ field: { onChange, value } }) => (
            <TextInput label="Level (1-10)" value={value} onChangeText={onChange} error={errors.level?.message} keyboardType="numeric" />
          )}
        />

        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, value } }) => (
            <TextInput label="Description" value={value} onChangeText={onChange} error={errors.description?.message} />
          )}
        />

        <Text style={styles.fieldLabel}>Associated Department</Text>
        <Controller
          control={control}
          name="departmentId"
          render={({ field: { onChange, value } }) => (
            <View style={styles.chipRow}>
              {departments.map((d) => (
                <Chip key={d.id} selected={value === d.id} onPress={() => onChange(d.id)} style={styles.chip}>
                  {d.name}
                </Chip>
              ))}
            </View>
          )}
        />
        {errors.departmentId ? <Text style={styles.errorText}>{errors.departmentId.message}</Text> : null}

        {isEditMode ? (
          <>
            <Text style={styles.fieldLabel}>Status</Text>
            <Controller
              control={control}
              name="status"
              render={({ field: { onChange, value } }) => (
                <View style={styles.chipRow}>
                  {statuses.map((s) => (
                    <Chip key={s.id} selected={value === s.id} onPress={() => onChange(s.id)} style={styles.chip}>
                      {s.label}
                    </Chip>
                  ))}
                </View>
              )}
            />
            {errors.status ? <Text style={styles.errorText}>{errors.status.message}</Text> : null}
          </>
        ) : null}

        <Button mode="contained" onPress={handleSubmit(onSubmit)} loading={isSaving} style={styles.submitButton}>
          Save Designation
        </Button>
      </ScrollView>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  fieldLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#3B82F6',
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 32,
  },
});
