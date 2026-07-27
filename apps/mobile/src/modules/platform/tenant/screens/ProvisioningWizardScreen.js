import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { Button } from '@/shared/components/Button';
import { useNavigation } from '@react-navigation/native';

export default function ProvisioningWizardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Provision New Tenant" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textPrimary text-lg font-bold mb-4">Provisioning Setup</Text>
        <Text className="text-textSecondary mb-6">Complete the workflow to initialize a new tenant, assign default modules, and setup the primary admin account.</Text>
        
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-6 items-center py-10">
          <Text className="text-textSecondary">[ Wizard Form Placeholder ]</Text>
        </View>

        <Button title="Start Provisioning" onPress={() => navigation.goBack()} styleClass="bg-primary" />
      </ScrollView>
    </View>
  );
}
