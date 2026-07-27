const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'tenant');

const files = {
  'components/TenantStatusBadge.js': `import React from 'react';
import { View, Text } from 'react-native';

export const TenantStatusBadge = ({ status }) => {
  let bgColor = 'bg-surface';
  let textColor = '#64748B';

  if (status === 'Active') {
    bgColor = 'bg-success/10';
    textColor = '#10B981';
  } else if (status === 'Provisioning' || status === 'Prospect') {
    bgColor = 'bg-primary/10';
    textColor = '#0EA5E9';
  } else if (status === 'Suspended' || status === 'Maintenance') {
    bgColor = 'bg-warning/10';
    textColor = '#F59E0B';
  } else if (status === 'Archived' || status === 'Deleted') {
    bgColor = 'bg-error/10';
    textColor = '#EF4444';
  }

  return (
    <View className={\`px-2 py-1 rounded-full \${bgColor}\`}>
      <Text style={{ color: textColor }} className="text-[10px] font-bold uppercase tracking-wider">{status}</Text>
    </View>
  );
};
`,

  'components/TenantCard.js': `import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { TenantStatusBadge } from './TenantStatusBadge';
import { Building, ChevronRight } from 'lucide-react-native';

export const TenantCard = ({ tenant, onPress }) => {
  return (
    <Pressable 
      onPress={() => onPress(tenant)}
      className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    >
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Building size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold">{tenant.name}</Text>
          <TenantStatusBadge status={tenant.status} />
        </View>
        <Text className="text-textSecondary text-xs mb-1">Code: {tenant.orgCode} | Industry: {tenant.industry}</Text>
        <Text className="text-textSecondary text-[10px]">Since: {new Date(tenant.createdAt).toLocaleDateString()}</Text>
      </View>
      <ChevronRight size={20} color="#94A3B8" className="ml-2" />
    </Pressable>
  );
};
`,

  'components/TenantTimeline.js': `import React from 'react';
import { View, Text } from 'react-native';
import { CheckCircle2, Clock } from 'lucide-react-native';

export const TenantTimeline = ({ events }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border">
      <Text className="text-lg font-bold text-textPrimary mb-4">Lifecycle Events</Text>
      {events.map((ev, index) => (
        <View key={ev.id} className="flex-row mb-4">
          <View className="items-center mr-3">
            {index === events.length - 1 ? (
              <Clock size={20} color="#0EA5E9" />
            ) : (
              <CheckCircle2 size={20} color="#10B981" />
            )}
            {index !== events.length - 1 && <View className="w-px h-full bg-border mt-1" />}
          </View>
          <View className="flex-1 pb-4">
            <View className="flex-row justify-between items-center mb-1">
              <Text className="text-textPrimary font-semibold text-sm">{ev.status}</Text>
              <Text className="text-textSecondary text-xs">{new Date(ev.timestamp).toLocaleDateString()}</Text>
            </View>
            <Text className="text-textSecondary text-xs mb-1">Actor: {ev.actor}</Text>
            <Text className="text-textPrimary text-xs">{ev.notes}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Tenant Lifecycle component files created successfully.');
