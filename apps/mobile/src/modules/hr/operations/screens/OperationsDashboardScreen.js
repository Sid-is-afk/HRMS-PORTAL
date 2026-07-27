import React from 'react';
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
