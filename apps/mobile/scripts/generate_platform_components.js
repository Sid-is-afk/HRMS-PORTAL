const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform');

const files = {
  'components/PlatformSummaryCard.js': `import React from 'react';
import { View, Text } from 'react-native';

export const PlatformSummaryCard = ({ title, value, status, icon: Icon }) => {
  let statusColor = '#64748B'; // default
  if (status === 'Healthy' || status === 'Operational') statusColor = '#10B981';
  if (status === 'Degraded') statusColor = '#F59E0B';
  if (status === 'Offline') statusColor = '#EF4444';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border w-[48%] mb-4">
      <View className="flex-row items-center mb-2">
        {Icon && <Icon size={16} color="#64748B" className="mr-2" />}
        <Text className="text-textSecondary text-xs">{title}</Text>
      </View>
      <Text className="text-textPrimary text-2xl font-bold mb-1">{value}</Text>
      {status && (
        <Text style={{ color: statusColor }} className="text-xs font-medium">{status}</Text>
      )}
    </View>
  );
};
`,

  'components/PlatformQuickActionCard.js': `import React from 'react';
import { Pressable, Text, View } from 'react-native';

export const PlatformQuickActionCard = ({ label, icon: Icon, onPress }) => {
  return (
    <Pressable 
      onPress={onPress}
      className="bg-white p-4 rounded-xl shadow-sm border border-border items-center justify-center flex-1 mx-1 mb-3"
    >
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mb-2">
        {Icon && <Icon size={20} color="#0EA5E9" />}
      </View>
      <Text className="text-textPrimary text-xs font-medium text-center">{label}</Text>
    </Pressable>
  );
};
`,

  'components/PlatformActivityCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Activity } from 'lucide-react-native';

export const PlatformActivityCard = ({ activity }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-start">
      <View className="mt-1 mr-3">
        <Activity size={16} color={activity.severity === 'Warning' ? '#F59E0B' : '#0EA5E9'} />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary text-sm font-medium mb-1">{activity.description}</Text>
        <Text className="text-textSecondary text-xs">{new Date(activity.timestamp).toLocaleString()}</Text>
      </View>
    </View>
  );
};
`,

  'components/PlatformNotificationCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Bell } from 'lucide-react-native';

export const PlatformNotificationCard = ({ notification }) => {
  return (
    <View className={\`p-4 rounded-xl shadow-sm border border-border mb-3 flex-row \${notification.read ? 'bg-surface' : 'bg-white'}\`}>
      <View className="mr-3">
        <Bell size={20} color={notification.read ? '#94A3B8' : '#0EA5E9'} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between mb-1">
          <Text className="text-textPrimary text-sm font-bold">{notification.title}</Text>
          <Text className="text-textSecondary text-xs">{new Date(notification.date).toLocaleDateString()}</Text>
        </View>
        <Text className="text-textSecondary text-sm">{notification.message}</Text>
      </View>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Platform component files created successfully.');
