const fs = require('fs');
const path = require('path');

const screensDir = path.join('src', 'modules', 'admin', 'reports', 'screens');

const screens = {
  'ReportsDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { BarChart2, Folder, Bookmark } from 'lucide-react-native';

export default function ReportsDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Reports & Analytics" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Generate, view, and manage organizational analytics and reports.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Analytics Overview" 
            onPress={() => navigation.navigate('AnalyticsOverview')} 
            styleClass="bg-primary"
            icon={<BarChart2 size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Report Explorer" 
            onPress={() => navigation.navigate('ReportExplorer')} 
            styleClass="bg-surface border border-border"
            textClass="text-textPrimary"
            icon={<Folder size={20} color="#0EA5E9" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Saved Reports" 
            onPress={() => navigation.navigate('SavedReports')} 
            styleClass="bg-surface border border-border"
            textClass="text-textPrimary"
            icon={<Bookmark size={20} color="#8B5CF6" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'ReportExplorerScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { ReportCard } from '../components/ReportCard';
import { useReports } from '../hooks/useReports';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function ReportExplorerScreen() {
  const { reports, isLoading, error } = useReports();

  const mockReports = reports.length > 0 ? reports : [
    { id: '1', title: 'Monthly Attendance Summary', description: 'Aggregated attendance data by department.' },
    { id: '2', title: 'Leave Balance Audit', description: 'Current leave balances across the entire organization.' },
    { id: '3', title: 'Employee Attrition Rate', description: 'Turnover statistics for the current fiscal year.' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Report Explorer" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {mockReports.map((report) => (
          <ReportCard key={report.id} report={report} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'AnalyticsOverviewScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { KpiCard } from '../components/KpiCard';
import { ChartContainer } from '../components/ChartContainer';
import { useAnalytics } from '../hooks/useAnalytics';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function AnalyticsOverviewScreen() {
  const { analyticsSummary, isLoading, error } = useAnalytics();

  const kpis = analyticsSummary?.kpis || [];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Analytics Overview" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <View className="flex-row justify-between mb-6">
          {kpis.map((kpi) => (
            <KpiCard key={kpi.id} metric={kpi} />
          ))}
        </View>

        <ChartContainer title="Attendance Trends (Last 30 Days)" />
        <ChartContainer title="Leave Distribution by Department" />
      </ScrollView>
    </View>
  );
}
`,

  'SavedReportsScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { SavedReportCard } from '../components/SavedReportCard';
import { useSavedReports } from '../hooks/useSavedReports';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function SavedReportsScreen() {
  const { savedReports, isLoading, error } = useSavedReports();

  const mockSaved = savedReports.length > 0 ? savedReports : [
    { id: '1', name: 'IT Department August Leaves', created_at: '2026-08-01' },
    { id: '2', name: 'Q2 Headcount Report', created_at: '2026-07-15' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Saved Reports" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {mockSaved.map((report) => (
          <SavedReportCard key={report.id} savedReport={report} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(screens)) {
  fs.writeFileSync(path.join(screensDir, filename), content);
}
console.log('Screens created successfully.');
