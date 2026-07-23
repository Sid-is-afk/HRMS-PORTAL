const fs = require('fs');
const path = require('path');

const screensDir = path.join('src', 'modules', 'admin', 'leave', 'screens');

const screens = {
  'LeaveDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { List, CheckSquare, Briefcase } from 'lucide-react-native';

export default function LeaveDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Leave Admin" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage leave requests, view employee balances, and handle approvals.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Leave Directory" 
            onPress={() => navigation.navigate('LeaveDirectory')} 
            icon={<List size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Approval Queue" 
            onPress={() => navigation.navigate('AdminApprovalQueue')} 
            styleClass="bg-warning"
            icon={<CheckSquare size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Leave Balances" 
            onPress={() => navigation.navigate('LeaveBalanceSummary')} 
            styleClass="bg-secondary"
            icon={<Briefcase size={20} color="white" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'LeaveDirectoryScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LeaveCard } from '../components/LeaveCard';
import { useLeave } from '../hooks/useLeave';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function LeaveDirectoryScreen() {
  const { leaveRequests, isLoading, error } = useLeave();

  const mockRequests = leaveRequests.length > 0 ? leaveRequests : [
    { id: '1', leave_type_name: 'Annual Leave', start_date: '2026-08-01', end_date: '2026-08-05', status: 'APPROVED', reason: 'Family vacation' },
    { id: '2', leave_type_name: 'Sick Leave', start_date: '2026-07-20', end_date: '2026-07-21', status: 'PENDING', reason: 'Fever' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="All Leave Requests" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockRequests.map((request) => (
          <LeaveCard key={request.id} request={request} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'LeaveBalanceSummaryScreen.js': `import React from 'react';
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
`
};

for (const [filename, content] of Object.entries(screens)) {
  fs.writeFileSync(path.join(screensDir, filename), content);
}
console.log('Screens created successfully.');
