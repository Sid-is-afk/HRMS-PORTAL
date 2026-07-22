import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useProfileStore } from '@/modules/employee/profile/store/profileStore';
import { DetailRow } from '../components/DetailRow';
import { InfoCard } from '../components/InfoCard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function AccountInfoScreen() {
  const { accountInfo, isLoading, error, fetchAccountInfo } = useProfileStore();

  useEffect(() => {
    fetchAccountInfo();
  }, [fetchAccountInfo]);

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="p-4">
        <Text className="text-textPrimary text-3xl font-bold mb-2">Account Information</Text>
        <Text className="text-textSecondary mb-4">Review your account settings and security details.</Text>
        {error ? <ErrorMessage message={error} /> : null}
        {isLoading ? <Text className="text-textSecondary">Loading account information...</Text> : null}

        {accountInfo ? (
          <InfoCard title="Security & Sign-in">
            <DetailRow label="Email" value={accountInfo.email} />
            <DetailRow label="Phone" value={accountInfo.phone} />
            <DetailRow label="Last Password Change" value={accountInfo.lastPasswordChange} />
            <DetailRow label="Two-Factor Enabled" value={accountInfo.twoFactorEnabled ? 'Yes' : 'No'} />
          </InfoCard>
        ) : null}
      </View>
    </ScrollView>
  );
}
