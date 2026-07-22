import React, { useEffect } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from '../components/SettingsSection';
import { ListItem } from '@/shared/components/ListItem';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function SettingsHomeScreen() {
  const navigation = useNavigation();
  const { settings, isLoading, error, fetchSettings } = useSettings();

  useEffect(() => {
    if (!settings) {
      fetchSettings();
    }
  }, [fetchSettings, settings]);

  if (isLoading && !settings) {
    return <LoadingOverlay visible message="Loading settings..." />;
  }

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">Settings</Text>
        <Text className="mb-4 text-sm text-slate-500">Manage your account, privacy, notifications and app preferences.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <SettingsSection title="Account">
          <ListItem title="Account Settings" subtitle="Review your account details and security status." onPress={() => navigation.navigate('AccountSettings')} />
          <ListItem title="Security Settings" subtitle="Control passwords, sign-in and security options." onPress={() => navigation.navigate('SecuritySettings')} />
        </SettingsSection>

        <SettingsSection title="Preferences">
          <ListItem title="Notification Preferences" subtitle="Choose how you receive updates." onPress={() => navigation.navigate('NotificationPreferences')} />
          <ListItem title="Privacy Settings" subtitle="Control your visibility and privacy options." onPress={() => navigation.navigate('PrivacySettings')} />
          <ListItem title="Language & Theme" subtitle="Set your language and preferred look." onPress={() => navigation.navigate('Preferences')} />
        </SettingsSection>

        <SettingsSection title="Support">
          <ListItem title="Help & Support" subtitle="Need help? Contact the support team." onPress={() => navigation.navigate('HelpAndSupport')} />
          <ListItem title="About Application" subtitle="Version, build and app details." onPress={() => navigation.navigate('AboutApplication')} />
        </SettingsSection>

        <SettingsSection title="Account Actions">
          <ListItem title="Logout" subtitle="Sign out of your current session." onPress={() => navigation.navigate('LogoutConfirmation')} destructive />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
