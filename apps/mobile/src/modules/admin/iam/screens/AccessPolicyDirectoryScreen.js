import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert, Modal } from 'react-native';
import { FAB, Checkbox, Searchbar } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { accessPolicySchema } from '../validation/iamSchema';
import AdminLayout from '../../components/AdminLayout';
import { useAccessPolicies } from '../hooks/useAccessPolicies';
import { AccessPolicyCard } from '../components/AccessPolicyCard';
import { Button } from '@/shared/components/Button';
import TextInput from '@/shared/components/TextInput';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';

export default function AccessPolicyDirectoryScreen() {
  const {
    accessPolicies,
    isLoading,
    error,
    createAccessPolicy,
    updateAccessPolicy,
    setFilters
  } = useAccessPolicies();

  const [searchVal, setSearchVal] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  // Form management for new policy
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(accessPolicySchema),
    defaultValues: {
      name: '',
      description: '',
      priority: 1,
      status: 'ACTIVE',
      conditions: {
        ipRange: '',
        timeWindowStart: '',
        timeWindowEnd: '',
        mfaRequired: false,
      }
    }
  });

  const handleSearch = (val) => {
    setSearchVal(val);
    setFilters({ policySearch: val });
  };

  const handleToggleStatus = async (id, status) => {
    try {
      await updateAccessPolicy(id, { status });
      Alert.alert('Success', `Policy ${status === 'ACTIVE' ? 'activated' : 'deactivated'}.`);
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to update policy status.');
    }
  };

  const handleCreatePolicy = async (data) => {
    try {
      await createAccessPolicy(data);
      setModalVisible(false);
      reset();
      Alert.alert('Success', 'Access policy created successfully.');
    } catch (err) {
      Alert.alert('Error', err.message || 'Failed to create policy.');
    }
  };

  return (
    <AdminLayout title="Access Policies">
      <View style={styles.container}>
        {error ? <ErrorMessage message={error} /> : null}

        <View style={styles.topActions}>
          <Searchbar
            placeholder="Search policies by name or description..."
            onChangeText={handleSearch}
            value={searchVal}
            style={styles.searchBar}
          />
        </View>

        {isLoading && accessPolicies.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            {accessPolicies.map((policy) => (
              <AccessPolicyCard
                key={policy.id}
                policy={policy}
                onToggleStatus={handleToggleStatus}
              />
            ))}
          </ScrollView>
        )}

        <FAB
          icon="shield-plus"
          label="Add Access Policy"
          style={styles.fab}
          color="#FFFFFF"
          onPress={() => setModalVisible(true)}
        />

        {/* Modal for adding policy */}
        <Modal
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <ScrollView style={styles.modalScroll}>
                <Text style={styles.modalTitle}>Configure Conditional Access Policy</Text>

                <View style={styles.formGroup}>
                  <Controller
                    control={control}
                    name="name"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Policy Name"
                        placeholder="e.g. Finance Sector MFA Enforcement"
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
                    name="description"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Description"
                        placeholder="Explain the security restrictions imposed by this policy..."
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                        error={errors.description?.message}
                        multiline={true}
                        numberOfLines={2}
                      />
                    )}
                  />
                </View>

                <View style={styles.formGroup}>
                  <Controller
                    control={control}
                    name="priority"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Evaluation Priority (1-100)"
                        placeholder="e.g. 10 (higher values evaluated first)"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value?.toString()}
                        error={errors.priority?.message}
                      />
                    )}
                  />
                </View>

                <Text style={styles.subTitle}>Conditions Configurations (Placeholders)</Text>

                <View style={styles.formGroup}>
                  <Controller
                    control={control}
                    name="conditions.ipRange"
                    render={({ field: { onChange, onBlur, value } }) => (
                      <TextInput
                        label="Office IP Range Bound (Optional CIDR)"
                        placeholder="e.g. 192.168.1.0/24"
                        onBlur={onBlur}
                        onChangeText={onChange}
                        value={value}
                      />
                    )}
                  />
                </View>

                <View style={styles.rowInputs}>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Controller
                      control={control}
                      name="conditions.timeWindowStart"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          label="Start Time"
                          placeholder="e.g. 08:00"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                  <View style={[styles.formGroup, { flex: 1 }]}>
                    <Controller
                      control={control}
                      name="conditions.timeWindowEnd"
                      render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                          label="End Time"
                          placeholder="e.g. 18:00"
                          onBlur={onBlur}
                          onChangeText={onChange}
                          value={value}
                        />
                      )}
                    />
                  </View>
                </View>

                <View style={styles.checkboxRow}>
                  <Controller
                    control={control}
                    name="conditions.mfaRequired"
                    render={({ field: { onChange, value } }) => (
                      <Checkbox.Android
                        status={value ? 'checked' : 'unchecked'}
                        onPress={() => onChange(!value)}
                      />
                    )}
                  />
                  <Text style={styles.checkboxLabel}>Enforce Multi-Factor Authentication (MFA)</Text>
                </View>

                <View style={styles.modalActions}>
                  <Button
                    title="Cancel"
                    variant="outline"
                    onPress={() => {
                      setModalVisible(false);
                      reset();
                    }}
                    style={styles.modalBtn}
                  />
                  <Button
                    title="Deploy Policy"
                    onPress={handleSubmit(handleCreatePolicy)}
                    style={styles.modalBtn}
                  />
                </View>
              </ScrollView>
            </View>
          </View>
        </Modal>
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  topActions: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  searchBar: {
    backgroundColor: '#FFFFFF',
    elevation: 0,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
  },
  list: {
    padding: 16,
    paddingBottom: 80,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#2563EB',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    width: '100%',
    maxWidth: 500,
    maxHeight: '90%',
    overflow: 'hidden',
    padding: 20,
  },
  modalScroll: {
    flex: 1,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    paddingBottom: 8,
  },
  subTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 12,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  formGroup: {
    marginBottom: 12,
  },
  rowInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 12,
  },
  checkboxLabel: {
    fontSize: 13,
    color: '#374151',
    marginLeft: 8,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  modalBtn: {
    minWidth: 100,
  },
});
