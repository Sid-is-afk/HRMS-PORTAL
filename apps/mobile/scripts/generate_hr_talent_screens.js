const fs = require('fs');
const path = require('path');

const baseDir = path.join('src', 'modules', 'hr', 'talent-development');

const files = {
  'screens/TalentDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { Target, BookOpen, ShieldCheck, TrendingUp } from 'lucide-react-native';

export default function TalentDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Talent Development" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage employee performance, learning catalogs, and compliance training across the organization.
        </Text>
        
        <View className="flex-row flex-wrap justify-between">
          <View className="w-[48%] mb-4">
            <Button 
              title="Performance" 
              onPress={() => navigation.navigate('PerformanceGoals')} 
              styleClass="bg-primary"
              icon={<Target size={20} color="white" />}
            />
          </View>
          <View className="w-[48%] mb-4">
            <Button 
              title="Learning" 
              onPress={() => navigation.navigate('LearningCatalog')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<BookOpen size={20} color="#64748B" />}
            />
          </View>
          <View className="w-[48%] mb-4">
            <Button 
              title="Compliance" 
              onPress={() => navigation.navigate('ComplianceCenter')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<ShieldCheck size={20} color="#64748B" />}
            />
          </View>
          <View className="w-[48%] mb-4">
            <Button 
              title="Growth" 
              onPress={() => navigation.navigate('DevelopmentPlans')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<TrendingUp size={20} color="#64748B" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'screens/PerformanceGoalsScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { GoalCard } from '../components/GoalCard';
import { useTalentDevelopment } from '../hooks/useTalentDevelopment';

export default function PerformanceGoalsScreen() {
  const { goals, isLoading, error } = useTalentDevelopment();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Performance Goals" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={goals}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <GoalCard goal={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No active goals found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/LearningCatalogScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { LearningCard } from '../components/LearningCard';
import { useTalentDevelopment } from '../hooks/useTalentDevelopment';

export default function LearningCatalogScreen() {
  const { courses, isLoading, error } = useTalentDevelopment();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Learning Catalog" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <LearningCard 
            course={item} 
            onPress={() => console.log('Open Course')}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No courses assigned.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/ComplianceCenterScreen.js': `import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { ComplianceBadge } from '../components/ComplianceBadge';
import { useTalentDevelopment } from '../hooks/useTalentDevelopment';

export default function ComplianceCenterScreen() {
  const { complianceRecords, isLoading, error } = useTalentDevelopment();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Compliance Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={complianceRecords}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <ComplianceBadge record={item} />}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No compliance records found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
`,

  'screens/DevelopmentPlansScreen.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function DevelopmentPlansScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Development Plans" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Individual development plan module placeholder.
        </Text>
      </View>
    </View>
  );
}
`,

  'screens/PerformanceReviewsScreen.js': `import React from 'react';
import { View, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function PerformanceReviewsScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Performance Reviews" showBack={true} />
      <View className="flex-1 items-center justify-center p-4">
        <Text className="text-textSecondary text-center">
          Performance reviews module placeholder.
        </Text>
      </View>
    </View>
  );
}
`
};

for (const [filename, content] of Object.entries(files)) {
  fs.writeFileSync(path.join(baseDir, filename), content);
}
console.log('HR Talent screen files created successfully.');
