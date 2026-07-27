import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';

export default function AuthenticationPoliciesScreen() {
  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Auth Policies" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <Text className="text-textPrimary font-bold mb-2">Password Policy</Text>
          <Text className="text-textSecondary text-sm mb-1">• Minimum Length: 12</Text>
          <Text className="text-textSecondary text-sm mb-1">• Require Special Characters: Yes</Text>
          <Text className="text-textSecondary text-sm mb-1">• Expiration: 90 Days</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <Text className="text-textPrimary font-bold mb-2">Session Policy</Text>
          <Text className="text-textSecondary text-sm mb-1">• Idle Timeout: 15 Minutes</Text>
          <Text className="text-textSecondary text-sm mb-1">• Max Duration: 12 Hours</Text>
        </View>
        <View className="bg-white p-4 rounded-xl shadow-sm border border-border mb-4">
          <Text className="text-textPrimary font-bold mb-2">MFA Policy</Text>
          <Text className="text-textSecondary text-sm">Enforced for all Super Admins.</Text>
        </View>
      </ScrollView>
    </View>
  );
}
