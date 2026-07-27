import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { FileText, UserCheck } from 'lucide-react-native';

export default function OfferDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Offer Management" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage hiring decisions and oversee candidate offers through to onboarding.
        </Text>
        
        <View className="mb-4 flex-row justify-between">
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-border mr-2 items-center">
            <Text className="text-2xl font-bold text-textPrimary">12</Text>
            <Text className="text-textSecondary text-xs">Pending</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-border mx-1 items-center">
            <Text className="text-2xl font-bold text-success">5</Text>
            <Text className="text-textSecondary text-xs">Accepted</Text>
          </View>
          <View className="flex-1 bg-white p-4 rounded-xl shadow-sm border border-border ml-2 items-center">
            <Text className="text-2xl font-bold text-error">2</Text>
            <Text className="text-textSecondary text-xs">Declined</Text>
          </View>
        </View>

        <View className="mb-4">
          <Button 
            title="Offer Directory" 
            onPress={() => navigation.navigate('OfferDirectory')} 
            styleClass="bg-primary"
            icon={<FileText size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Decision Center" 
            onPress={() => navigation.navigate('DecisionCenter')} 
            styleClass="bg-surface border border-border"
            textClass="text-textPrimary"
            icon={<UserCheck size={20} color="#64748B" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
