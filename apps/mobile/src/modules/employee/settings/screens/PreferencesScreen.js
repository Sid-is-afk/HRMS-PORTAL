import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from '../components/SettingsSection';
import { PreferenceSelector } from '../components/PreferenceSelector';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function PreferencesScreen() {
  const { preferences, updatePreferences, error } = useSettings();
  const [localPreferences, setLocalPreferences] = useState(preferences);

  const handleSelect = async (key, value) => {
    const nextPreferences = { ...localPreferences, [key]: value };
    setLocalPreferences(nextPreferences);
    await updatePreferences(nextPreferences);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">Language & Theme</Text>
        <Text className="mb-4 text-sm text-slate-500">Choose how the app looks and feels.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <SettingsSection title="Language">
          <PreferenceSelector
            label="Preferred language"
            options={[
              { label: 'English', value: 'en' },
              { label: 'Hindi', value: 'hi' },
            ]}
            value={localPreferences.language}
            onSelect={(value) => handleSelect('language', value)}
          />
        </SettingsSection>

        <SettingsSection title="Theme">
          <PreferenceSelector
            label="App theme"
            options={[
              { label: 'System', value: 'system' },
              { label: 'Light', value: 'light' },
              { label: 'Dark', value: 'dark' },
            ]}
            value={localPreferences.theme}
            onSelect={(value) => handleSelect('theme', value)}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
