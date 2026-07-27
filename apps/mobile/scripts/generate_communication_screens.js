const fs = require('fs');
const path = require('path');

const screensDir = path.join('src', 'modules', 'admin', 'communication', 'screens');

const screens = {
  'CommunicationDashboardScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { Megaphone, Edit3, Archive, FileText } from 'lucide-react-native';

export default function CommunicationDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Communication Center" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Broadcast notices, alerts, and policies across the organization.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Create Announcement" 
            onPress={() => {}} 
            styleClass="bg-primary"
            icon={<Megaphone size={20} color="white" />}
          />
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Button 
              title="All Messages" 
              onPress={() => navigation.navigate('AnnouncementDirectory')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
            />
          </View>
          <View className="flex-1 ml-2">
            <Button 
              title="Drafts" 
              onPress={() => {}} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Edit3 size={16} color="#0EA5E9" />}
            />
          </View>
        </View>

        <View className="flex-row justify-between mb-4">
          <View className="flex-1 mr-2">
            <Button 
              title="Templates" 
              onPress={() => navigation.navigate('CommunicationTemplates')} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<FileText size={16} color="#0EA5E9" />}
            />
          </View>
          <View className="flex-1 ml-2">
            <Button 
              title="Archives" 
              onPress={() => {}} 
              styleClass="bg-surface border border-border"
              textClass="text-textPrimary"
              icon={<Archive size={16} color="#64748B" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
`,

  'AnnouncementDirectoryScreen.js': `import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { AnnouncementCard } from '../components/AnnouncementCard';
import { useAnnouncements } from '../hooks/useAnnouncements';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';

export default function AnnouncementDirectoryScreen() {
  const { announcements, isLoading, error } = useAnnouncements();

  const mockAnnouncements = announcements.length > 0 ? announcements : [
    { id: '1', title: 'Q3 Townhall Meeting', type_id: 'Notice', status: 'PUBLISHED', created_at: '2026-07-23' },
    { id: '2', title: 'New Remote Work Policy', type_id: 'Policy Update', status: 'SCHEDULED', created_at: '2026-07-22' },
  ];

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Announcements" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {error ? <Text className="text-error mb-4">{error}</Text> : null}
        
        {mockAnnouncements.map((announcement) => (
          <AnnouncementCard key={announcement.id} announcement={announcement} onPress={() => {}} />
        ))}
      </ScrollView>
    </View>
  );
}
`,

  'CommunicationTemplatesScreen.js': `import React from 'react';
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
`
};

for (const [filename, content] of Object.entries(screens)) {
  fs.writeFileSync(path.join(screensDir, filename), content);
}
console.log('Screens created successfully.');
