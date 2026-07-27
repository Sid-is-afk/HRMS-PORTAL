const fs = require('fs');
const path = require('path');

const screensDir = path.join('src', 'modules', 'admin', 'attendance', 'screens');

const screens = {
  'AttendanceDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { List, Calendar, AlertCircle } from 'lucide-react-native';

export default function AttendanceDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Attendance Admin" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Monitor employee attendance, exceptions, and regularization requests.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Attendance Directory" 
            onPress={() => navigation.navigate('AttendanceDirectory')} 
            icon={<List size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Exceptions & Alerts" 
            onPress={() => {}} 
            styleClass="bg-warning"
            icon={<AlertCircle size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Regularization Queue" 
            onPress={() => navigation.navigate('AdminApprovalQueue')} 
            styleClass="bg-secondary"
            icon={<Calendar size={20} color="white" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'AttendanceDirectoryScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AttendanceCard } from '../components/AttendanceCard';
import { useAttendance } from '../hooks/useAttendance';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function AttendanceDirectoryScreen() {
  const { attendanceRecords, isLoading, error } = useAttendance();

  const mockRecords = attendanceRecords.length > 0 ? attendanceRecords : [
    { id: '1', attendance_date: '2026-07-23', clock_in: '09:05', clock_out: '18:10', status: 'PRESENT' },
    { id: '2', attendance_date: '2026-07-22', clock_in: '09:20', clock_out: '18:00', status: 'HALF_DAY' },
    { id: '3', attendance_date: '2026-07-21', clock_in: '--:--', clock_out: '--:--', status: 'ABSENT' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Daily Attendance" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white">
        <Text className="text-textSecondary text-sm">Today's Logs</Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockRecords.map((record) => (
          <AttendanceCard key={record.id} record={record} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'EmployeeAttendanceSummaryScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AttendanceSummaryCard } from '../components/AttendanceSummaryCard';
import { useAttendanceSummary } from '../hooks/useAttendanceSummary';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function EmployeeAttendanceSummaryScreen({ route }) {
  const { employeeId } = route?.params || { employeeId: '123' };
  const { attendanceSummary, isLoading, error } = useAttendanceSummary(employeeId, 'MONTHLY');

  const mockSummary = attendanceSummary || {
    totalPresent: 20,
    totalAbsent: 2,
    totalLateArrivals: 3,
    totalEarlyExits: 1
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Employee Summary" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <Text className="text-textPrimary font-semibold text-base mb-2">Monthly Overview</Text>
        <AttendanceSummaryCard summary={mockSummary} />
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
