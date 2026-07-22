import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { useLeaveStore } from '@/modules/employee/leave/store/leaveStore';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { Button } from '@/shared/components/Button';

export default function LeaveDetailsScreen() {
  const route = useRoute();
  const requestId = route.params?.requestId;
  const { currentRequest, isLoading, error, fetchLeaveDetails, cancelLeave, isSubmitting } = useLeaveStore();

  useEffect(() => {
    if (requestId) {
      fetchLeaveDetails(requestId);
    }
  }, [requestId, fetchLeaveDetails]);

  const handleCancel = async () => {
    try {
      await cancelLeave(requestId);
    } catch {
      // Error handled in store
    }
  };

  if (!currentRequest && isLoading) {
    return (
      <View className="flex-1 bg-surface p-4">
        <Text className="text-textPrimary">Loading request details...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="p-4">
        <Text className="text-textPrimary text-3xl font-bold mb-2">Leave Details</Text>
        {error ? <ErrorMessage message={error} /> : null}

        {currentRequest ? (
          <View className="bg-white border border-border rounded-2xl p-4">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-textPrimary text-xl font-semibold">{currentRequest.leaveType}</Text>
              <StatusBadge status={currentRequest.status} />
            </View>
            <Text className="text-textSecondary mb-2">Dates: {currentRequest.startDate} to {currentRequest.endDate}</Text>
            <Text className="text-textSecondary mb-2">Duration: {currentRequest.duration} day(s)</Text>
            <Text className="text-textSecondary mb-2">Half Day: {currentRequest.halfDay ? 'Yes' : 'No'}</Text>
            <Text className="text-textSecondary mb-4">Reason: {currentRequest.reason}</Text>
            {currentRequest.status === 'PENDING' ? (
              <Button title="Cancel Request" loading={isSubmitting} variant="outline" onPress={handleCancel} />
            ) : null}
          </View>
        ) : null}
      </View>
    </ScrollView>
  );
}
