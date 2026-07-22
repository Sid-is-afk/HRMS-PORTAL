import React, { useEffect, useMemo } from 'react';
import { View, Text, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useLeaveStore } from '@/modules/employee/leave/store/leaveStore';
import { useLeaveBalance } from '../hooks/useLeaveBalance';
import { useLeaveHistory } from '../hooks/useLeaveHistory';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import { LeaveHistoryItem } from '../components/LeaveHistoryItem';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { TopHeader } from '@/shared/components/TopHeader';

export default function LeaveScreen() {
  const navigation = useNavigation();
  const { balance, isLoading: balanceLoading, error: balanceError } = useLeaveBalance();
  const { history, isLoading: historyLoading, isRefreshing, error: historyError, refreshHistory } = useLeaveHistory();
  const { leaveTypes, fetchLeaveTypes } = useLeaveStore();

  useEffect(() => {
    fetchLeaveTypes();
  }, [fetchLeaveTypes]);

  const error = balanceError || historyError;
  const isInitialLoading = balanceLoading && !balance;

  const recentHistory = useMemo(() => history.slice(0, 4), [history]);

  return (
    <View style={{ flex: 1 }} className="bg-surface">
      <View className="bg-white">
        <TopHeader />
      </View>
      {isInitialLoading ? <LoadingOverlay visible message="Loading leave data..." /> : null}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshHistory} />}
      >
        <View className="p-4">
          <Text className="text-textPrimary text-3xl font-bold mb-1">Leave Management</Text>
          <Text className="text-textSecondary mb-4">Track balances, submit requests, and review your history.</Text>

          {error ? <ErrorMessage message={error} /> : null}

          <LeaveBalanceCard balance={balance} />

          <View className="flex-row gap-2 mb-4">
            <Button title="Apply Leave" onPress={() => navigation.navigate('ApplyLeave')} styleClass="flex-1" />
            <Button title="History" variant="secondary" onPress={() => navigation.navigate('LeaveHistory')} styleClass="flex-1" />
          </View>

          <View className="bg-white border border-border rounded-2xl p-4 mb-4">
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-textPrimary font-semibold">Recent Requests</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LeaveHistory')}>
                <Text className="text-primary font-semibold">See All</Text>
              </TouchableOpacity>
            </View>
            {historyLoading ? <Text className="text-textSecondary">Loading requests...</Text> : null}
            {recentHistory.length > 0 ? (
              recentHistory.map((item) => (
                <LeaveHistoryItem key={item.id} item={item} onPress={() => navigation.navigate('LeaveDetails', { requestId: item.id })} />
              ))
            ) : (
              <Text className="text-textSecondary">No leave requests yet.</Text>
            )}
          </View>

          <View className="bg-white border border-border rounded-2xl p-4">
            <Text className="text-textPrimary font-semibold mb-2">Leave Types</Text>
            {leaveTypes.map((item) => (
              <View key={item.id} className="py-2 border-b border-border last:border-0">
                <Text className="text-textPrimary font-medium">{item.label}</Text>
                <Text className="text-textSecondary text-sm">{item.description}</Text>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
