import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { referenceValueSchema } from '../validation/masterDataSchema';
import { Button } from '@/shared/components/Button';
import TextInput from '@/shared/components/TextInput';
import { Switch, SegmentedButtons } from 'react-native-paper';

export function ReferenceValueEditor({ initialValues, onSubmit, onCancel, isLoading }) {
  const isEdit = !!initialValues;

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(referenceValueSchema),
    defaultValues: {
      code: '',
      name: '',
      description: '',
      status: 'ACTIVE',
      metadata: {
        color: '#3B82F6',
        allowOverallocate: false,
        requiresDocumentProof: false,
      }
    },
  });

  useEffect(() => {
    if (initialValues) {
      reset({
        code: initialValues.code || '',
        name: initialValues.name || '',
        description: initialValues.description || '',
        status: initialValues.status || 'ACTIVE',
        metadata: {
          color: initialValues.metadata?.color || '#3B82F6',
          allowOverallocate: initialValues.metadata?.allowOverallocate || false,
          requiresDocumentProof: initialValues.metadata?.requiresDocumentProof || false,
        }
      });
    } else {
      reset({
        code: '',
        name: '',
        description: '',
        status: 'ACTIVE',
        metadata: {
          color: '#3B82F6',
          allowOverallocate: false,
          requiresDocumentProof: false,
        }
      });
    }
  }, [initialValues, reset]);

  return (
    <View style={styles.form}>
      {/* Code */}
      <Controller
        control={control}
        name="code"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="System Code"
            value={value}
            onChangeText={(text) => onChange(text.toUpperCase())}
            error={errors.code?.message}
            placeholder="e.g. SICK_LEAVE"
            editable={!isEdit} // Block code updates during edits
          />
        )}
      />
      {isEdit && (
        <Text style={styles.helper}>
          System code cannot be changed once created.
        </Text>
      )}

      {/* Name */}
      <Controller
        control={control}
        name="name"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Display Name"
            value={value}
            onChangeText={onChange}
            error={errors.name?.message}
            placeholder="e.g. Sick Leave"
          />
        )}
      />

      {/* Description */}
      <Controller
        control={control}
        name="description"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Description"
            value={value || ''}
            onChangeText={onChange}
            error={errors.description?.message}
            placeholder="e.g. Paid leave for medical recovery"
            multiline
            numberOfLines={3}
          />
        )}
      />

      {/* Status Selection */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>Status</Text>
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
                { value: 'ARCHIVED', label: 'Archived' },
              ]}
              style={styles.segmented}
            />
          )}
        />
      </View>

      {/* Metadata - Custom Options */}
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Conditional Attributes</Text>
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Requires Document Proof</Text>
          <Text style={styles.switchDescription}>Require verification files upon request</Text>
        </View>
        <Controller
          control={control}
          name="metadata.requiresDocumentProof"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} color="#4F46E5" />
          )}
        />
      </View>

      <View style={styles.switchRow}>
        <View style={styles.switchInfo}>
          <Text style={styles.switchLabel}>Allow Overallocate</Text>
          <Text style={styles.switchDescription}>Allow overdrafts past standard bounds</Text>
        </View>
        <Controller
          control={control}
          name="metadata.allowOverallocate"
          render={({ field: { onChange, value } }) => (
            <Switch value={value} onValueChange={onChange} color="#4F46E5" />
          )}
        />
      </View>

      <View style={styles.actions}>
        <Button
          mode="outlined"
          onPress={onCancel}
          style={styles.cancelBtn}
          labelStyle={styles.cancelLabel}
        >
          Cancel
        </Button>
        <Button
          mode="contained"
          onPress={handleSubmit(onSubmit)}
          style={styles.submitBtn}
          loading={isLoading}
          disabled={isLoading}
        >
          {isEdit ? 'Save Changes' : 'Create Value'}
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    padding: 4,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  segmented: {
    backgroundColor: '#FFFFFF',
  },
  helper: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: -8,
    marginBottom: 12,
  },
  sectionHeader: {
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#4B5563',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F9FAFB',
  },
  switchInfo: {
    flex: 1,
    paddingRight: 16,
  },
  switchLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  switchDescription: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 24,
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    borderRadius: 6,
  },
  cancelBtn: {
    borderColor: '#D1D5DB',
    borderRadius: 6,
  },
  cancelLabel: {
    color: '#4B5563',
  },
});
