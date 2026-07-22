const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'modules', 'admin', 'workforce', 'components');

const components = {
  'ShiftCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { StatusBadge } from '@/shared/components/StatusBadge';
import { Clock } from 'lucide-react-native';

export const ShiftCard = ({ shift, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3"
    onPress={onPress}
  >
    <View className="flex-row justify-between items-start mb-2">
      <View className="flex-row items-center">
        <View className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: shift.color || '#3B82F6' }} />
        <Text className="text-textPrimary font-semibold text-base">{shift.name}</Text>
      </View>
      <StatusBadge status={shift.status} />
    </View>
    <View className="flex-row items-center mt-1">
      <Clock size={14} color="#64748B" />
      <Text className="text-textSecondary ml-1 text-sm">{shift.startTime} - {shift.endTime}</Text>
      <Text className="text-textSecondary ml-4 text-sm">{shift.type}</Text>
    </View>
  </TouchableOpacity>
);
`,

  'HolidayCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Calendar } from 'lucide-react-native';

export const HolidayCard = ({ holiday, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-4">
      <Calendar size={20} color="#2563EB" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold text-base">{holiday.name}</Text>
      <Text className="text-textSecondary text-sm">{holiday.date}</Text>
    </View>
    <View className="bg-background px-3 py-1 rounded-full">
      <Text className="text-textSecondary text-xs font-medium">{holiday.type}</Text>
    </View>
  </TouchableOpacity>
);
`,

  'AttendancePolicyCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';

export const AttendancePolicyCard = ({ policy, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-surface rounded-full items-center justify-center mr-4 border border-border">
      <FileText size={20} color="#475569" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold text-base">{policy.name}</Text>
      <Text className="text-textSecondary text-xs mt-1">
        Grace In: {policy.graceIn}m • Grace Out: {policy.graceOut}m
      </Text>
    </View>
    <ChevronRight size={20} color="#94A3B8" />
  </TouchableOpacity>
);
`,

  'ConfigurationSummaryCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

export const ConfigurationSummaryCard = ({ title, description, icon: Icon, onPress, status }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4"
    onPress={onPress}
  >
    <View className="flex-row items-start">
      <View className="w-12 h-12 bg-primary/10 rounded-xl items-center justify-center mr-4">
        {Icon && <Icon size={24} color="#2563EB" />}
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold text-lg">{title}</Text>
        <Text className="text-textSecondary text-sm mt-1 mb-2">{description}</Text>
        {status && (
          <View className="self-start bg-success/10 px-2 py-1 rounded-md">
            <Text className="text-success text-xs font-medium">{status}</Text>
          </View>
        )}
      </View>
    </View>
  </TouchableOpacity>
);
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
}
console.log('Components created successfully.');
