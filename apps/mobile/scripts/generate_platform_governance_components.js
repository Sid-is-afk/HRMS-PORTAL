const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'governance');

const files = {
  'components/FeatureCard.js': `import React from 'react';
import { View, Text, Switch } from 'react-native';
import { Settings2 } from 'lucide-react-native';

export const FeatureCard = ({ feature, onToggle }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Settings2 size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold mr-2">{feature.name}</Text>
          <View className="px-2 py-0.5 rounded-full bg-surface">
            <Text className="text-[9px] text-textSecondary uppercase font-bold tracking-wider">{feature.rolloutStage}</Text>
          </View>
        </View>
        <Text className="text-textSecondary text-xs">{feature.description}</Text>
        <Text className="text-textSecondary text-[10px] mt-1">Category: {feature.category}</Text>
      </View>
      <Switch 
        value={feature.enabled} 
        onValueChange={(val) => onToggle && onToggle(feature.id, val)}
        trackColor={{ false: '#E2E8F0', true: '#10B981' }}
      />
    </View>
  );
};
`,

  'components/ModuleCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Package } from 'lucide-react-native';

export const ModuleCard = ({ module }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center">
      <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
        <Package size={20} color={module.isCore ? '#6366F1' : '#0EA5E9'} />
      </View>
      <View className="flex-1">
        <View className="flex-row items-center mb-1">
          <Text className="text-textPrimary text-sm font-bold mr-2">{module.name}</Text>
          {module.isCore && (
            <View className="px-2 py-0.5 rounded-full bg-[#6366F1]/10">
              <Text className="text-[9px] text-[#6366F1] uppercase font-bold tracking-wider">Core</Text>
            </View>
          )}
        </View>
        <Text className="text-textSecondary text-xs">{module.description}</Text>
        <Text className="text-textSecondary text-[10px] mt-1">Status: {module.status}</Text>
      </View>
    </View>
  );
};
`,

  'components/SubscriptionCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { CreditCard } from 'lucide-react-native';
import { Button } from '@/shared/components/Button';

export const SubscriptionCard = ({ plan }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
      <View className="flex-row items-center mb-4">
        <View className="w-10 h-10 rounded-full bg-surface items-center justify-center mr-3">
          <CreditCard size={20} color="#F59E0B" />
        </View>
        <Text className="text-textPrimary text-lg font-bold">{plan.name}</Text>
      </View>
      
      <View className="border-t border-border pt-3 mb-4">
        <View className="flex-row justify-between mb-2">
          <Text className="text-textSecondary text-xs">User Limit</Text>
          <Text className="text-textPrimary text-xs font-bold">{plan.userLimit.toLocaleString()}</Text>
        </View>
        <View className="flex-row justify-between mb-2">
          <Text className="text-textSecondary text-xs">Storage Limit</Text>
          <Text className="text-textPrimary text-xs font-bold">{plan.storageLimitGb} GB</Text>
        </View>
        <View className="flex-row justify-between">
          <Text className="text-textSecondary text-xs">Included Modules</Text>
          <Text className="text-textPrimary text-xs font-bold">{plan.includedModules.length}</Text>
        </View>
      </View>

      <Button title="Edit Plan" onPress={() => {}} styleClass="bg-surface border border-border h-8" textClass="text-textPrimary text-xs" />
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Governance component files created successfully.');
