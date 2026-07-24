import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { TemplateCard } from '../components/TemplateCard';
import { useCommunicationTemplates } from '../hooks/useCommunicationTemplates';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function CommunicationTemplatesScreen() {
  const { templates, isLoading, error } = useCommunicationTemplates();

  const mockTemplates = templates.length > 0 ? templates : [
    { id: '1', name: 'Emergency Server Outage', type_id: 'Alert' },
    { id: '2', name: 'Welcome New Hires', type_id: 'Announcement' },
    { id: '3', name: 'Holiday Greetings', type_id: 'Notice' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Message Templates" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        <Text className="text-textSecondary text-sm mb-4">
          Select a template to quickly draft a new communication.
        </Text>
        
        {mockTemplates.map((template) => (
          <TemplateCard key={template.id} template={template} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
