import React, { useEffect } from 'react';
import { View, ScrollView, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLeaveStore } from '@/modules/employee/leave/store/leaveStore';
import { LeaveRequestForm } from '../components/LeaveRequestForm';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function ApplyLeaveScreen() {
  const navigation = useNavigation();
  const { leaveTypes, fetchLeaveTypes, applyLeave, isSubmitting, error } = useLeaveStore();

  useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  const handleSubmit = async (values) => {
    try {
      const request = await applyLeave(values);
      navigation.navigate('LeaveDetails', { requestId: request.id });
    } catch {
      // Error handled in store
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="p-4">
        <Text className="text-textPrimary text-3xl font-bold mb-2">New Leave Request</Text>
        <Text className="text-textSecondary mb-4">Submit a leave request and track its progress.</Text>

        {error ? <ErrorMessage message={error} /> : null}

        <LeaveRequestForm leaveTypes={leaveTypes} onSubmit={handleSubmit} isSubmitting={isSubmitting} />
      </View>
    </ScrollView>
  );
}
