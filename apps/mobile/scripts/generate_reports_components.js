const fs = require('fs');
const path = require('path');

const componentsDir = path.join('src', 'modules', 'admin', 'reports', 'components');

const components = {
  'ReportCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { FileText, ChevronRight } from 'lucide-react-native';

export const ReportCard = ({ report, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center justify-between"
    onPress={onPress}
  >
    <View className="flex-row items-center flex-1 pr-4">
      <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
        <FileText size={20} color="#0EA5E9" />
      </View>
      <View className="flex-1">
        <Text className="text-textPrimary font-semibold" numberOfLines={1}>{report.title}</Text>
        <Text className="text-textSecondary text-xs mt-1" numberOfLines={2}>{report.description}</Text>
      </View>
    </View>
    <ChevronRight size={20} color="#CBD5E1" />
  </TouchableOpacity>
);
`,

  'SavedReportCard.js': `import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Bookmark, Clock } from 'lucide-react-native';

export const SavedReportCard = ({ savedReport, onPress }) => (
  <TouchableOpacity 
    className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row items-center"
    onPress={onPress}
  >
    <View className="w-10 h-10 bg-secondary/10 rounded-full items-center justify-center mr-3">
      <Bookmark size={20} color="#8B5CF6" />
    </View>
    <View className="flex-1">
      <Text className="text-textPrimary font-semibold">{savedReport.name}</Text>
      <View className="flex-row items-center mt-1">
        <Clock size={12} color="#64748B" />
        <Text className="text-textSecondary text-xs ml-1">Generated: {savedReport.created_at}</Text>
      </View>
    </View>
  </TouchableOpacity>
);
`,

  'KpiCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

export const KpiCard = ({ metric }) => {
  const isUp = metric.trend_direction === 'up';
  const isDown = metric.trend_direction === 'down';
  
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border flex-1 mx-1">
      <Text className="text-textSecondary text-xs font-medium mb-1">{metric.label}</Text>
      <Text className="text-textPrimary text-xl font-bold">{metric.value}</Text>
      
      {metric.trend_percentage !== undefined && (
        <View className="flex-row items-center mt-2">
          {isUp && <TrendingUp size={14} color="#10B981" />}
          {isDown && <TrendingDown size={14} color="#EF4444" />}
          {!isUp && !isDown && <Minus size={14} color="#64748B" />}
          
          <Text className={\`text-xs ml-1 \${isUp ? 'text-success' : isDown ? 'text-error' : 'text-textSecondary'}\`}>
            {metric.trend_percentage}%
          </Text>
        </View>
      )}
    </View>
  );
};
`,

  'ChartContainer.js': `import React from 'react';
import { View, Text } from 'react-native';

export const ChartContainer = ({ title, children }) => (
  <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
    {title && <Text className="text-textPrimary font-semibold mb-4">{title}</Text>}
    <View className="items-center justify-center min-h-[200px]">
      {children || <Text className="text-textSecondary italic">Chart visualization placeholder</Text>}
    </View>
  </View>
);
`
};

for (const [filename, content] of Object.entries(components)) {
  fs.writeFileSync(path.join(componentsDir, filename), content);
}
console.log('Components created successfully.');
