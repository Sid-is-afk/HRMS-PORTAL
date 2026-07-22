const fs = require('fs');
const path = require('path');

const screensDir = path.join('src', 'modules', 'admin', 'workforce', 'screens');

const screens = {
  'WorkforceOverviewScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ConfigurationSummaryCard } from '../components/ConfigurationSummaryCard';
import { useNavigation } from '@react-navigation/native';
import { Clock, Calendar, ShieldCheck, Briefcase } from 'lucide-react-native';

export default function WorkforceOverviewScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Workforce Configuration" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage core workforce policies, shifts, and holiday calendars for the organization.
        </Text>
        
        <ConfigurationSummaryCard
          title="Shift Management"
          description="Configure shift timings, break durations, and shift templates."
          icon={Clock}
          status="3 Active Shifts"
          onPress={() => navigation.navigate('ShiftDirectory')}
        />
        
        <ConfigurationSummaryCard
          title="Holiday Calendar"
          description="Manage national, regional, and company-specific holidays."
          icon={Calendar}
          status="Calendar 2026 Set"
          onPress={() => navigation.navigate('HolidayCalendar')}
        />

        <ConfigurationSummaryCard
          title="Attendance Policies"
          description="Configure grace periods, late arrival rules, and checkout thresholds."
          icon={ShieldCheck}
          status="Standard Policy"
          onPress={() => navigation.navigate('AttendancePolicyDirectory')}
        />

        <ConfigurationSummaryCard
          title="Working Hours & Weekly Off"
          description="Define standard weekly hours and company-wide off days."
          icon={Briefcase}
          onPress={() => {}}
        />
      </ScrollView>
    </View>
  );
}
`,

  'ShiftDirectoryScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ShiftCard } from '../components/ShiftCard';
import { useShifts } from '../hooks/useShifts';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { Plus } from 'lucide-react-native';

export default function ShiftDirectoryScreen() {
  const { shifts, isLoading, error } = useShifts();

  // Mock data to ensure screen renders if API is empty
  const mockShifts = shifts.length > 0 ? shifts : [
    { id: '1', name: 'Morning Shift', type: 'Standard', startTime: '09:00', endTime: '18:00', color: '#3B82F6', status: 'ACTIVE' },
    { id: '2', name: 'Evening Shift', type: 'Standard', startTime: '15:00', endTime: '23:30', color: '#8B5CF6', status: 'ACTIVE' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Shift Directory" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
        <Text className="text-textSecondary text-sm">Manage organization shifts</Text>
        <Button title="Add Shift" onPress={() => {}} icon={<Plus size={16} color="white" />} styleClass="py-2 px-3" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockShifts.map((shift) => (
          <ShiftCard key={shift.id} shift={shift} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'HolidayCalendarScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { HolidayCard } from '../components/HolidayCard';
import { useHolidayCalendar } from '../hooks/useHolidayCalendar';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { Plus } from 'lucide-react-native';

export default function HolidayCalendarScreen() {
  const { holidayCalendars, isLoading, error } = useHolidayCalendar();

  const mockHolidays = holidayCalendars.length > 0 ? holidayCalendars : [
    { id: '1', name: 'New Year', date: '2026-01-01', type: 'NATIONAL' },
    { id: '2', name: 'Republic Day', date: '2026-01-26', type: 'NATIONAL' },
    { id: '3', name: 'Diwali', date: '2026-11-08', type: 'REGIONAL' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Holiday Calendar" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
        <Text className="text-textSecondary text-sm">2026 Calendar</Text>
        <Button title="Add Holiday" onPress={() => {}} icon={<Plus size={16} color="white" />} styleClass="py-2 px-3" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockHolidays.map((holiday) => (
          <HolidayCard key={holiday.id} holiday={holiday} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'AttendancePolicyDirectoryScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AttendancePolicyCard } from '../components/AttendancePolicyCard';
import { useAttendancePolicies } from '../hooks/useAttendancePolicies';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { Plus } from 'lucide-react-native';

export default function AttendancePolicyDirectoryScreen() {
  const { attendancePolicies, isLoading, error } = useAttendancePolicies();

  const mockPolicies = attendancePolicies.length > 0 ? attendancePolicies : [
    { id: '1', name: 'Standard Policy', graceIn: 15, graceOut: 0, lateArrivalThreshold: 15 },
    { id: '2', name: 'Strict Policy (Contractors)', graceIn: 5, graceOut: 5, lateArrivalThreshold: 5 },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Attendance Policies" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white flex-row justify-between items-center">
        <Text className="text-textSecondary text-sm">Global & Custom Policies</Text>
        <Button title="Create Policy" onPress={() => {}} icon={<Plus size={16} color="white" />} styleClass="py-2 px-3" />
      </View>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error">{error}</Text> : null}
        
        {mockPolicies.map((policy) => (
          <AttendancePolicyCard key={policy.id} policy={policy} onPress={() => {}} />
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
