import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsToggle } from '../components/SettingsToggle';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function NotificationPreferencesScreen() {
  const { notificationPreferences, updateNotificationSettings, error } = useSettings();
  const [localPreferences, setLocalPreferences] = useState(notificationPreferences);

  const handleToggle = async (key, value) => {
    const nextPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(nextPreferences);
    await updateNotificationSettings(nextPreferences);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">Notification Preferences</Text>
        <Text className="mb-4 text-sm text-slate-500">Choose the updates you want to receive.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <SettingsSection title="Channels">
          <SettingsToggle label="Push notifications" description="Receive real-time mobile alerts." value={localPreferences.push} onValueChange={(value) => handleToggle('push', value)} />
          <SettingsToggle label="Email notifications" description="Receive summary emails." value={localPreferences.email} onValueChange={(value) => handleToggle('email', value)} />
          <SettingsToggle label="SMS notifications" description="Receive concise SMS reminders." value={localPreferences.sms} onValueChange={(value) => handleToggle('sms', value)} />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
