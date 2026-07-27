const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'people-intelligence');

const files = {
  'screens/ExecutiveDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { ExecutiveKpiCard } from '../components/ExecutiveKpiCard';
import { TrendChartCard } from '../components/TrendChartCard';
import { usePeopleIntelligence } from '../hooks/usePeopleIntelligence';
import { Users, UserPlus, Target, BookOpen, Lightbulb } from 'lucide-react-native';

export default function ExecutiveDashboardScreen() {
  const navigation = useNavigation();
  const { executiveKpis, isLoading, error } = usePeopleIntelligence();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="People Intelligence" showBack={true} />
      <AnalyticsFilterBar />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <View className="flex-row flex-wrap justify-between mb-4">
          <View className="w-[48%] mb-4">
            <Button title="Workforce" onPress={() => navigation.navigate('WorkforceAnalytics')} styleClass="bg-primary" icon={<Users size={20} color="white" />} />
          </View>
          <View className="w-[48%] mb-4">
            <Button title="Recruitment" onPress={() => navigation.navigate('RecruitmentAnalytics')} styleClass="bg-surface border border-border" textClass="text-textPrimary" icon={<UserPlus size={20} color="#64748B" />} />
          </View>
          <View className="w-[48%] mb-4">
            <Button title="Performance" onPress={() => navigation.navigate('PerformanceAnalytics')} styleClass="bg-surface border border-border" textClass="text-textPrimary" icon={<Target size={20} color="#64748B" />} />
          </View>
          <View className="w-[48%] mb-4">
            <Button title="Learning" onPress={() => navigation.navigate('LearningAnalytics')} styleClass="bg-surface border border-border" textClass="text-textPrimary" icon={<BookOpen size={20} color="#64748B" />} />
          </View>
          <View className="w-full">
            <Button title="Insights Hub" onPress={() => navigation.navigate('InsightsHub')} styleClass="bg-surface border border-border" textClass="text-textPrimary" icon={<Lightbulb size={20} color="#F59E0B" />} />
          </View>
        </View>

        <Text className="text-lg font-bold text-textPrimary mb-3">Executive KPIs</Text>
        <View className="flex-row flex-wrap justify-between">
          {executiveKpis.map(kpi => <ExecutiveKpiCard key={kpi.id} kpi={kpi} />)}
        </View>

        <TrendChartCard title="Overall Organization Health" data={[]} />
      </ScrollView>
    </View>
  );
}
`,

  'screens/WorkforceAnalyticsScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';
import { usePeopleIntelligence } from '../hooks/usePeopleIntelligence';

export default function WorkforceAnalyticsScreen() {
  const { workforceMetrics, isLoading } = usePeopleIntelligence();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Workforce Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Headcount Distribution" data={workforceMetrics} />
        <TrendChartCard title="Tenure Distribution" data={[]} />
      </ScrollView>
    </View>
  );
}
`,

  'screens/RecruitmentAnalyticsScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';

export default function RecruitmentAnalyticsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Recruitment Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Hiring Funnel" data={[]} />
        <TrendChartCard title="Time to Fill Trends" data={[]} />
      </ScrollView>
    </View>
  );
}
`,

  'screens/PerformanceAnalyticsScreen.js': `import React from 'react';
import { View, ScrollView } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';

export default function PerformanceAnalyticsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Performance Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Goal Completion Rate" data={[]} />
        <TrendChartCard title="Performance Distribution" data={[]} />
      </ScrollView>
    </View>
  );
}
`,

  'screens/LearningAnalyticsScreen.js': `import React from 'react';
import { View, ScrollView } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AnalyticsFilterBar } from '../components/AnalyticsFilterBar';
import { TrendChartCard } from '../components/TrendChartCard';

export default function LearningAnalyticsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Learning Analytics" showBack={true} />
      <AnalyticsFilterBar />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <TrendChartCard title="Course Completion" data={[]} />
        <TrendChartCard title="Compliance Score" data={[]} />
      </ScrollView>
    </View>
  );
}
`,

  'screens/InsightsHubScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { InsightCard } from '../components/InsightCard';
import { usePeopleIntelligence } from '../hooks/usePeopleIntelligence';

export default function InsightsHubScreen() {
  const { insights, isLoading, error } = usePeopleIntelligence();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Insights Hub" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={insights}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <InsightCard insight={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No new insights generated.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Intelligence screen files created successfully.');
