const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'people-intelligence');

const files = {
  'components/ExecutiveKpiCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TrendingUp, TrendingDown, Minus } from 'lucide-react-native';

export const ExecutiveKpiCard = ({ kpi }) => {
  let Icon = Minus;
  let color = '#64748B';

  if (kpi.trend === 'up') {
    Icon = TrendingUp;
    color = '#10B981';
  } else if (kpi.trend === 'down') {
    Icon = TrendingDown;
    color = '#EF4444';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border w-[48%] mb-4">
      <Text className="text-textSecondary text-xs mb-2">{kpi.title}</Text>
      <Text className="text-textPrimary text-2xl font-bold mb-2">{kpi.value}</Text>
      <View className="flex-row items-center">
        <Icon size={14} color={color} className="mr-1" />
        <Text style={{ color }} className="text-xs font-medium">{kpi.percentage} vs last month</Text>
      </View>
    </View>
  );
};
`,

  'components/InsightCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { Lightbulb, AlertTriangle, Info } from 'lucide-react-native';

export const InsightCard = ({ insight }) => {
  let Icon = Info;
  let color = '#0EA5E9';
  let bgColor = 'bg-primary/10';

  if (insight.impact === 'High') {
    Icon = AlertTriangle;
    color = '#EF4444';
    bgColor = 'bg-error/10';
  } else if (insight.impact === 'Medium') {
    Icon = Lightbulb;
    color = '#F59E0B';
    bgColor = 'bg-warning/10';
  }

  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-3 flex-row">
      <View className={\`w-10 h-10 rounded-full items-center justify-center mr-3 \${bgColor}\`}>
        <Icon size={20} color={color} />
      </View>
      <View className="flex-1">
        <View className="flex-row justify-between items-center mb-1">
          <Text className="text-textSecondary text-xs font-medium uppercase tracking-wider">{insight.category}</Text>
          <Text className="text-textSecondary text-xs">{new Date(insight.date).toLocaleDateString()}</Text>
        </View>
        <Text className="text-textPrimary text-sm leading-5">{insight.summary}</Text>
      </View>
    </View>
  );
};
`,

  'components/AnalyticsFilterBar.js': `import React from 'react';
import { View, Text, ScrollView, Pressable } from 'react-native';
import { Filter } from 'lucide-react-native';

export const AnalyticsFilterBar = () => {
  const filters = ['Global', 'Engineering', 'Sales', 'Marketing', 'Last 90 Days'];

  return (
    <View className="bg-white py-3 border-b border-border">
      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-4">
        <View className="flex-row items-center mr-3 bg-surface p-2 rounded">
          <Filter size={16} color="#64748B" className="mr-1" />
          <Text className="text-textSecondary text-sm font-medium">Filters</Text>
        </View>
        {filters.map((f, i) => (
          <Pressable key={i} className="bg-surface px-4 py-2 rounded-full mr-2 border border-border">
            <Text className="text-textPrimary text-sm">{f}</Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};
`,

  'components/TrendChartCard.js': `import React from 'react';
import { View, Text } from 'react-native';
import { BarChart2 } from 'lucide-react-native';

export const TrendChartCard = ({ title, data }) => {
  // Mocking a chart view since we don't have charting libraries
  return (
    <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
      <Text className="text-textPrimary font-semibold mb-4">{title}</Text>
      <View className="h-40 bg-surface rounded items-center justify-center border border-border border-dashed">
        <BarChart2 size={32} color="#94A3B8" className="mb-2" />
        <Text className="text-textSecondary text-sm">[Chart Visualization Placeholder]</Text>
        <View className="flex-row flex-wrap justify-center mt-2 px-2">
          {data?.map((d, i) => (
            <Text key={i} className="text-xs text-textSecondary mr-2">{d.label}: {d.value}</Text>
          ))}
        </View>
      </View>
    </View>
  );
};
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Intelligence component files created successfully.');
