const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'modules', 'admin', 'attendance', 'components');

const components = {
  'AttendanceCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Clock } from 'lucide-react-native';

export const AttendanceCard = ({ record, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <Text className="text-textPrimary font-semibold text-base">{record.attendance_date}</Text>
      <StatusBadge status={record.status} />
    </View>
    <View className="flex-row items-center mt-1">
      <Clock size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">In: {record.clock_in} - Out: {record.clock_out}</Text>
    </View>
  </TouchableOpacity>
);
`,

  'AttendanceSummaryCard.js': `import React from 'react';
import { View, Text } from 'react-native';

export const AttendanceSummaryCard = ({ summary }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4 flex-row flex-wrap justify-between">
    <View className="w-[48%] mb-4">
      <Text className="text-textSecondary text-xs">Total Present</Text>
      <Text className="text-textPrimary font-bold text-lg">{summary?.totalPresent || 0}</Text>
    </View>
    <View className="w-[48%] mb-4">
      <Text className="text-textSecondary text-xs">Total Absent</Text>
      <Text className="text-textPrimary font-bold text-lg">{summary?.totalAbsent || 0}</Text>
    </View>
    <View className="w-[48%]">
      <Text className="text-textSecondary text-xs">Late Arrivals</Text>
      <Text className="text-error font-bold text-lg">{summary?.totalLateArrivals || 0}</Text>
    </View>
    <View className="w-[48%]">
      <Text className="text-textSecondary text-xs">Early Exits</Text>
      <Text className="text-warning font-bold text-lg">{summary?.totalEarlyExits || 0}</Text>
    </View>
  </View>
);
`,

  'AttendanceExceptionCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AlertCircle } from 'lucide-react-native';

export const AttendanceExceptionCard = ({ exception, onPress }) => (
  <TouchableOpacity 
    className="bg-error/5 p-4 rounded-xl border border-error/20 mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-error/10 rounded-full items-center justify-center mr-4">
      <AlertCircle size={20} color="#EF4444" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold text-base">{exception.type}</Text>
      <Text className="text-textSecondary text-xs mt-1">Severity: {exception.severity}</Text>
    </View>
    <View className="bg-white px-3 py-1 rounded-full border border-border">
      <Text className="text-textSecondary text-xs font-medium">{exception.resolved ? 'Resolved' : 'Pending'}</Text>
    </View>
  </TouchableOpacity>
);
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
}
console.log('Components created successfully.');
