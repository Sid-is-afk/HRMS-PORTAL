import React from 'react';
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
