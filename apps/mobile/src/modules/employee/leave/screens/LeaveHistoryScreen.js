import React from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLeaveHistory } from '../hooks/useLeaveHistory';
import { LeaveHistoryItem } from '../components/LeaveHistoryItem';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function LeaveHistoryScreen() {
  const navigation = useNavigation();
  const { history, isLoading, isRefreshing, error, refreshHistory } = useLeaveHistory();

  return (
    <View className="flex-1 bg-surface">
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshHistory} />}
      >
        <View className="p-4">
          <Text className="text-textPrimary text-3xl font-bold mb-2">Leave History</Text>
          <Text className="text-textSecondary mb-4">View all leave requests raised by you.</Text>

          {error ? <ErrorMessage message={error} /> : null}

          {isLoading && history.length === 0 ? <Text className="text-textSecondary">Loading requests...</Text> : null}

          {history.map((item) => (
            <LeaveHistoryItem key={item.id} item={item} onPress={() => navigation.navigate('LeaveDetails', { requestId: item.id })} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
