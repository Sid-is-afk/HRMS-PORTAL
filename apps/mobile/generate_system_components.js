const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'modules', 'admin', 'system', 'components');

const components = {
  'FeatureFlagCard.js': `import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Flag } from 'lucide-react-native';

export const FeatureFlagCard = ({ featureFlag, onToggle }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center justify-between">
    <View className="flex-row items-center flex-1 pr-4">
      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
        <Flag size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold">{featureFlag.name}</Text>
        <Text className="text-textSecondary text-xs mt-1">{featureFlag.description}</Text>
      </View>
    </View>
    <Switch 
      value={featureFlag.is_enabled} 
      onValueChange={() => onToggle(featureFlag.id, featureFlag.is_enabled)}
      trackColor={{ false: '#CBD5E1', true: '#0EA5E9' }}
    />
  </View>
);
`,

  'HealthStatusCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Activity, AlertTriangle, XCircle } from 'lucide-react-native';

export const HealthStatusCard = ({ metric }) => {
  const isHealthy = metric.status === 'healthy';
  const isDegraded = metric.status === 'degraded';
  const isDown = metric.status === 'down';
  
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className={\`w-10 h-10 rounded-full items-center justify-center mr-3 \${isHealthy ? 'bg-success/10' : isDegraded ? 'bg-warning/10' : 'bg-error/10'}\`}>
        {isHealthy && <Activity size={20} color="#10B981" />}
        {isDegraded && <AlertTriangle size={20} color="#F59E0B" />}
        {isDown && <XCircle size={20} color="#EF4444" />}
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold">{metric.service_name}</Text>
        <View className="flex-row items-center mt-1">
          <Text className={\`text-xs font-medium mr-2 \${isHealthy ? 'text-success' : isDegraded ? 'text-warning' : 'text-error'}\`}>
            {metric.status.toUpperCase()}
          </Text>
          <Text className="text-textSecondary text-xs">{metric.latency_ms}ms latency</Text>
        </View>
      </View>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
}
console.log('Components created successfully.');
