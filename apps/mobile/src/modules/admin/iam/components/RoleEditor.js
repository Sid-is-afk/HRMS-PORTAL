import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleSchema } from '../validation/iamSchema';
import { Button } from '@/shared/components/Button';
import TextInput from '@/shared/components/TextInput';
import { SegmentedButtons } from 'react-native-paper';

export function RoleEditor({ initialValues, isEdit = false, onSubmit, onCancel, isLoading }) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleSchema),
    defaultValues: {
      name: '',
      code: '',
      description: '',
      parentRoleId: '',
      status: 'ACTIVE',
      permissions: [],
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        name: initialValues.name || '',
        code: initialValues.code?.replace('ROLE_', '') || '',
        description: initialValues.description || '',
        parentRoleId: initialValues.parentRoleId || '',
        status: initialValues.status || 'ACTIVE',
        permissions: initialValues.permissions || [],
      });
    }
  }, [initialValues, reset]);

  const handleFormSubmit = (data) => {
    // Re-apply prefix if needed
    const finalCode = data.code.startsWith('ROLE_') ? data.code : `ROLE_${data.code.toUpperCase()}`;
    onSubmit?.({
      ...data,
      code: finalCode,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>{isEdit ? 'Edit Role Scope' : 'Create Custom Role'}</Text>
      
      <View style={styles.formGroup}>
        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Role Name"
              placeholder="e.g. Talent Coordinator"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.name?.message}
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Controller
          control={control}
          name="code"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Role Code"
              placeholder="e.g. HR_SPECIALIST"
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.code?.message}
              editable={!isEdit} // Block code updates in edit mode
              helperText="Uppercase, numbers, and underscores only. Prefix ROLE_ will be appended."
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Controller
          control={control}
          name="description"
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              label="Description"
              placeholder="Explain the administrative scope and utility of this role..."
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              error={errors.description?.message}
              multiline={true}
              numberOfLines={3}
            />
          )}
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Role Status</Text>
        <Controller
          control={control}
          name="status"
          render={({ field: { onChange, value } }) => (
            <SegmentedButtons
              value={value}
              onValueChange={onChange}
              buttons={[
                { value: 'ACTIVE', label: 'Active' },
                { value: 'INACTIVE', label: 'Inactive' },
                { value: 'ARCHIVED', label: 'Archived', disabled: !isEdit },
              ]}
              style={styles.segmented}
            />
          )}
        />
        {errors.status && <Text style={styles.errorText}>{errors.status.message}</Text>}
      </View>

      <View style={styles.actions}>
        <Button
          title="Cancel"
          variant="outline"
          onPress={onCancel}
          style={styles.btn}
          disabled={isLoading}
        />
        <Button
          title={isEdit ? 'Save Changes' : 'Create Role'}
          onPress={handleSubmit(handleFormSubmit)}
          style={styles.btn}
          loading={isLoading}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 10,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#374151',
    marginBottom: 8,
  },
  segmented: {
    marginTop: 4,
  },
  errorText: {
    fontSize: 12,
    color: '#DC2626',
    marginTop: 4,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  btn: {
    minWidth: 120,
  },
});
