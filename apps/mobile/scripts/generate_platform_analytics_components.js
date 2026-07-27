const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'platform', 'analytics');

const files = {
  'components/ExecutiveMetricCard.js': `import React from 'react';
import { View, Text } from 'react-native';

export const ExecutiveMetricCard = ({ title, value, icon: Icon, trend }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 w-[48%]">
      <View className="flex-row items-center mb-2">
        <View className="w-8 h-8 rounded-full bg-surface items-center justify-center mr-2">
          {Icon && <Icon size={16} color="#6366F1" />}
        </View>
        <Text className="text-textSecondary text-[10px] uppercase font-bold flex-1" numberOfLines={1}>{title}</Text>
      </View>
      <Text className="text-textPrimary text-xl font-bold">{value}</Text>
      {trend && (
        <Text className={\`text-xs mt-1 font-bold \${trend === 'Up' ? 'text-[#10B981]' : 'text-[#EF4444]'}\`}>
          {trend === 'Up' ? '↑' : '↓'} Trending
        </Text>
      )}
    </View>
  );
};
`,

  'components/TrendCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

export const TrendCard = ({ trend }) => {
  const isUp = trend.trend === 'Up';
  const isFlat = trend.trend === 'Flat';
  const color = isUp ? '#10B981' : isFlat ? '#94A3B8' : '#EF4444';

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center justify-between">
      <View>
        <Text className="text-textPrimary text-sm font-bold mb-1">{trend.label}</Text>
        <Text className="text-textSecondary text-xs">{trend.value.toLocaleString()}</Text>
      </View>
      <View className="items-end flex-row">
        {isUp ? <TrendingUp size={16} color={color} className="mr-1" /> : 
         isFlat ? <Minus size={16} color={color} className="mr-1" /> : 
         <TrendingDown size={16} color={color} className="mr-1" />}
        <Text className="text-xs font-bold" style={{ color }}>{trend.percentageChange > 0 ? '+' : ''}{trend.percentageChange}%</Text>
      </View>
    </View>
  );
};
`,

  'components/UsageHeatmap.js': `import React from 'react';
import { View, Text } from 'react-native';

export const UsageHeatmap = ({ metric }) => {
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3">
      <View className="flex-row justify-between items-center mb-2">
        <Text className="text-textPrimary text-sm font-bold">{metric.feature}</Text>
        <Text className="text-textSecondary text-xs">{metric.usageCount.toLocaleString()} hits</Text>
      </View>
      <View className="w-full bg-surface h-2 rounded-full overflow-hidden">
        <View className="bg-[#6366F1] h-full" style={{ width: \`\${Math.min((metric.usageCount / 2000000) * 100, 100)}%\` }} />
      </View>
      <Text className="text-textSecondary text-[10px] mt-2 text-right">{metric.uniqueUsers.toLocaleString()} Unique Users</Text>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('Analytics component files created successfully.');
