import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { SettingsSection } from '../components/SettingsSection';

export default function AboutApplicationScreen() {
  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">About Application</Text>
        <Text className="mb-4 text-sm text-slate-500">Version and product information.</Text>

        <SettingsSection title="Application Info">
          <View className="rounded-xl border border-slate-200 bg-white p-3">
            <Text className="text-sm font-semibold text-slate-900">HRMS Portal</Text>
            <Text className="mt-1 text-sm text-slate-500">Version 1.0.0</Text>
            <Text className="mt-1 text-sm text-slate-500">Employee Settings Module</Text>
          </View>
        </SettingsSection>
      </ScrollView>
    </SafeAreaView>
  );
}
