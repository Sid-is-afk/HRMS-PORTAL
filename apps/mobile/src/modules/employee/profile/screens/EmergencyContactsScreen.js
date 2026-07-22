import React, { useEffect } from 'react';
import { View, Text, ScrollView } from 'react-native';
import { useEmergencyContacts } from '../hooks/useEmergencyContacts';
import { ContactCard } from '../components/ContactCard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function EmergencyContactsScreen() {
  const { emergencyContacts, isLoading, error } = useEmergencyContacts();

  useEffect(() => {
    // hook loads data on mount
  }, []);

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="p-4">
        <Text className="text-textPrimary text-3xl font-bold mb-2">Emergency Contacts</Text>
        <Text className="text-textSecondary mb-4">Keep emergency contact information updated.</Text>
        {error ? <ErrorMessage message={error} /> : null}
        {isLoading ? <Text className="text-textSecondary">Loading contacts...</Text> : null}
        {emergencyContacts.map((contact) => (
          <ContactCard key={contact.id} contact={contact} />
        ))}
      </View>
    </ScrollView>
  );
}
