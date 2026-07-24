import React from 'react';
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
