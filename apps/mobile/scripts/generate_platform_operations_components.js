const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'operations');

const files = {
  'components/HealthStatusCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Server, Activity, AlertTriangle } from 'lucide-react-native';

export const HealthStatusCard = ({ service }) => {
  const getStatusColor = (status) => {
    switch(status) {
      case 'Healthy': return '#10B981';
      case 'Warning': return '#F59E0B';
      case 'Critical': return '#EF4444';
      default: return '#94A3B8';
    }
  };

  const color = getStatusColor(service.status);

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full items-center justify-center mr-3" style={{ backgroundColor: \`\${color}15\` }}>
        <Server size={20} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary text-sm font-bold mb-1">{service.name}</Text>
        <Text className="text-textSecondary text-xs">Response: {service.responseTimeMs}ms</Text>
      </View>
      <View className="items-end">
        <Text className="text-xs font-bold uppercase mb-1" style={{ color }}>{service.status}</Text>
        <Text className="text-textSecondary text-[9px]">{new Date(service.lastChecked).toLocaleTimeString()}</Text>
      </View>
    </View>
  );
};
`,

  'components/IncidentCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { AlertTriangle, Info } from 'lucide-react-native';

export const IncidentCard = ({ incident }) => {
  const isCritical = incident.severity === 'Critical' || incident.severity === 'High';
  const color = isCritical ? '#EF4444' : '#F59E0B';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
      <View className="flex-row items-center mb-3">
        <View className="w-8 h-8 rounded-full items-center justify-center mr-3" style={{ backgroundColor: \`\${color}15\` }}>
          {isCritical ? <AlertTriangle size={16} color={color} /> : <Info size={16} color={color} />}
        </View>
        <View className="flex-1">
          <Text className="text-textPrimary text-sm font-bold">{incident.title}</Text>
          <Text className="text-textSecondary text-[10px] uppercase font-bold tracking-wider mt-1">{incident.status} • {incident.severity}</Text>
        </View>
      </View>
      <View className="bg-surface p-2 rounded flex-row justify-between items-center">
        <Text className="text-textSecondary text-xs">Affected: {incident.affectedServices.join(', ')}</Text>
        <Text className="text-textSecondary text-[10px]">{new Date(incident.createdAt).toLocaleDateString()}</Text>
      </View>
    </View>
  );
};
`,

  'components/LogViewer.js': `import React from 'react';
import { View, Text } from 'react-native';

export const LogViewer = ({ log }) => {
  const getLevelColor = (level) => {
    switch(level) {
      case 'ERROR': return '#EF4444';
      case 'WARN': return '#F59E0B';
      default: return '#10B981';
    }
  };

  return (
    <View className="border-b border-border py-2 flex-row">
      <Text className="text-textSecondary text-xs mr-2 w-20" numberOfLines={1}>{new Date(log.timestamp).toLocaleTimeString()}</Text>
      <Text className="text-xs font-bold w-12" style={{ color: getLevelColor(log.level) }}>{log.level}</Text>
      <Text className="text-textSecondary text-xs mr-2 w-16" numberOfLines={1}>[{log.source}]</Text>
      <Text className="text-textPrimary text-xs flex-1">{log.message}</Text>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Operations component files created successfully.');
