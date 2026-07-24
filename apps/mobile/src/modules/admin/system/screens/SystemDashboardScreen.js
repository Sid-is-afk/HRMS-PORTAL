import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { Activity, Settings, Flag, Shield } from 'lucide-react-native';

export default function SystemDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="System Administration" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Govern application settings, monitor health, and review audit logs.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="System Health" 
            onPress={() => navigation.navigate('SystemHealth')} 
            styleClass="bg-primary"
            icon={<Activity size={20} color="white" />}
          />
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Button 
              title="Settings" 
              onPress={() => navigation.navigate('ApplicationSettings')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Settings size={16} color="#64748B" />}
            />
          </View>
          <View className="flex-1 ml-2">
            <Button 
              title="Feature Flags" 
              onPress={() => navigation.navigate('FeatureFlags')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Flag size={16} color="#0EA5E9" />}
            />
          </View>
        </View>

        <View className="mb-4">
          <Button 
            title="Audit & Activity Logs" 
            onPress={() => navigation.navigate('AuditLogs')} 
            styleClass="bg-surface border border-border"
            textClass="text-textPrimary"
            icon={<Shield size={20} color="#8B5CF6" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
