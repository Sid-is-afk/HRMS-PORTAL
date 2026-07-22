import React, { useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useSettings } from '../hooks/useSettings';
import { SettingsSection } from '../components/SettingsSection';
import { SettingsToggle } from '../components/SettingsToggle';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function SecuritySettingsScreen() {
  const { securitySettings, updateSettings, error } = useSettings();
  const [localSettings, setLocalSettings] = useState(securitySettings);

  const handleToggle = async (key, value) => {
    const nextSettings = { ...localSettings, [key]: value };
    setLocalSettings(nextSettings);
    await updateSettings({ securitySettings: nextSettings });
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">Security Settings</Text>
        <Text className="mb-4 text-sm text-slate-500">Keep your account secure with available protections.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <SettingsSection title="Security Preferences">
          <SettingsToggle
            label="Two-factor authentication"
            description="Require an additional verification step."
            value={localSettings.twoFactorEnabled}
            onValueChange={(value) => handleToggle('twoFactorEnabled', value)}
          />
          <SettingsToggle
            label="Biometric sign-in"
            description="Use biometrics for quick access."
            value={localSettings.biometricsEnabled}
            onValueChange={(value) => handleToggle('biometricsEnabled', value)}
          />
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
