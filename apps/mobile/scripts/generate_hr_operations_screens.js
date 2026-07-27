const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'operations');

const files = {
  'screens/OperationsDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { Briefcase, Zap, CheckSquare, Bell, FileText } from 'lucide-react-native';

export default function OperationsDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="HR Operations" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage day-to-day HR services, automate tasks, and resolve employee cases.
        </Text>
        
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-4">
            <Button 
              title="Requests" 
              onPress={() => navigation.navigate('ServiceRequestCenter')} 
              styleClass="bg-primary"
              icon={<FileText size={20} color="white" />}
            />
          </View>
          <View className="w-[48%] mb-4">
            <Button 
              title="Cases" 
              onPress={() => navigation.navigate('CaseManagement')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Briefcase size={20} color="#64748B" />}
            />
          </View>
          <View className="w-[48%] mb-4">
            <Button 
              title="Approvals" 
              onPress={() => navigation.navigate('ApprovalQueue')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<CheckSquare size={20} color="#64748B" />}
            />
          </View>
          <View className="w-[48%] mb-4">
            <Button 
              title="Automation" 
              onPress={() => navigation.navigate('AutomationCenter')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Zap size={20} color="#64748B" />}
            />
          </View>
          <View className="w-[48%] mb-4">
            <Button 
              title="Reminders" 
              onPress={() => navigation.navigate('ReminderCenter')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Bell size={20} color="#64748B" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'screens/ServiceRequestCenterScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ServiceRequestCard } from '../components/ServiceRequestCard';
import { useOperations } from '../hooks/useOperations';

export default function ServiceRequestCenterScreen() {
  const { serviceRequests, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Service Requests" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={serviceRequests}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ServiceRequestCard request={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No open service requests.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/CaseManagementScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { CaseCard } from '../components/CaseCard';
import { useOperations } from '../hooks/useOperations';

export default function CaseManagementScreen() {
  const { cases, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Case Management" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={cases}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <CaseCard hrCase={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No active cases.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/AutomationCenterScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { AutomationRuleCard } from '../components/AutomationRuleCard';
import { useOperations } from '../hooks/useOperations';

export default function AutomationCenterScreen() {
  const { automationRules, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Automation Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={automationRules}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <AutomationRuleCard rule={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No automation rules configured.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/ReminderCenterScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ReminderCard } from '../components/ReminderCard';
import { useOperations } from '../hooks/useOperations';

export default function ReminderCenterScreen() {
  const { reminders, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Reminder Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={reminders}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ReminderCard reminder={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No reminders scheduled.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/ApprovalQueueScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ApprovalQueueCard } from '../components/ApprovalQueueCard';
import { useOperations } from '../hooks/useOperations';

export default function ApprovalQueueScreen() {
  const { approvals, isLoading, error } = useOperations();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Approval Queue" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={approvals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ApprovalQueueCard approval={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No pending approvals.</Text>
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
console.log('HR Operations screen files created successfully.');
