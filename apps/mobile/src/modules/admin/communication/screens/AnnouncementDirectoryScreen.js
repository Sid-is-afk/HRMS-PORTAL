import React from 'react';
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
