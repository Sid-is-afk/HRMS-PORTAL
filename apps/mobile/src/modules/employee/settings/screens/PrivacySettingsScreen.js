import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsToggle } from '../components/SettingsToggle';
import { PreferenceSelector } from '../components/PreferenceSelector';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function PrivacySettingsScreen() {
  const { privacySettings, updateSettings, error } = useSettings();
  const [localSettings, setLocalSettings] = useState(privacySettings);

  const handleToggle = async (key, value) => {
    const nextSettings = { ...localSettings, [key]: value };
    setLocalSettings(nextSettings);
    await updateSettings({ privacySettings: nextSettings });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">Privacy Settings</Text>
        <Text className="mb-4 text-sm text-slate-500">Control how your profile information is shared.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <SettingsSection title="Visibility">
          <PreferenceSelector
            label="Profile visibility"
            options={[
              { label: 'Employees', value: 'employees' },
              { label: 'Managers', value: 'managers' },
              { label: 'Only me', value: 'private' },
            ]}
            value={localSettings.profileVisibility}
            onSelect={(value) => handleToggle('profileVisibility', value)}
          />
        </SettingsSection>

        <SettingsSection title="Online Presence">
          <SettingsToggle label="Show online status" description="Let team members see when you are online." value={localSettings.showOnlineStatus} onValueChange={(value) => handleToggle('showOnlineStatus', value)} />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
