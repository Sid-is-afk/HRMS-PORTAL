import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LeaveBalanceCard } from '../components/LeaveBalanceCard';
import { useLeaveBalances } from '../hooks/useLeaveBalances';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function LeaveBalanceSummaryScreen({ route }) {
  const { employeeId } = route?.params || { employeeId: '123' };
  const { leaveBalances, isLoading, error } = useLeaveBalances(employeeId);

  const mockBalances = leaveBalances.length > 0 ? leaveBalances : [
    { id: '1', leave_type_name: 'Annual Leave', allocated: 20, consumed: 5, balance: 15 },
    { id: '2', leave_type_name: 'Sick Leave', allocated: 10, consumed: 2, balance: 8 },
    { id: '3', leave_type_name: 'Casual Leave', allocated: 5, consumed: 0, balance: 5 },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Leave Balances" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <Text className="text-textPrimary font-semibold text-base mb-4">Current Balances</Text>
        
        {mockBalances.map((balance) => (
          <LeaveBalanceCard key={balance.id} balance={balance} />
        ))}
      </ScrollView>
    </View>
  );
}
