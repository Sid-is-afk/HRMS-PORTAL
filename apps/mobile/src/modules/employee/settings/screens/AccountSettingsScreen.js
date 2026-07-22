import React from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from '../components/SettingsSection';
import { ListItem } from '@/shared/components/ListItem';

export default function AccountSettingsScreen() {
  const navigation = useNavigation();
  const { settings } = useSettings();

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">Account Settings</Text>
        <Text className="mb-4 text-sm text-slate-500">Review and update your account-related preferences.</Text>

        <SettingsSection title="Account Overview">
          <ListItem title="Email" subtitle={settings?.email || 'yourname@company.com'} />
          <ListItem title="Phone" subtitle={settings?.phone || '+91 98765 43210'} />
          <ListItem title="Employee ID" subtitle={settings?.employeeId || 'EMP00001'} />
        </SettingsSection>

        <SettingsSection title="Security Actions">
          <ListItem title="Change Password" subtitle="Update your password securely." onPress={() => navigation.navigate('SecuritySettings')} />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
