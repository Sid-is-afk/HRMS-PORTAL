import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { Users, CheckSquare, Shield } from 'lucide-react-native';

export default function LifecycleDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Employee Lifecycle" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage employee conversions, onboarding processes, and probation tracking.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Candidate Conversions" 
            onPress={() => navigation.navigate('EmployeeConversion')} 
            styleClass="bg-primary"
            icon={<Users size={20} color="white" />}
          />
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Button 
              title="Onboarding" 
              onPress={() => navigation.navigate('OnboardingWorkspace')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<CheckSquare size={16} color="#64748B" />}
            />
          </View>
          <View className="flex-1 ml-2">
            <Button 
              title="Probation Tracking" 
              onPress={() => navigation.navigate('ProbationTracker')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Shield size={16} color="#64748B" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
