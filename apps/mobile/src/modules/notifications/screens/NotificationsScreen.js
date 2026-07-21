import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { FlatList, Pressable, ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNotificationsStore } from '@/modules/notifications/store/notificationsStore';
import { notificationsService } from '@/modules/notifications/services/notificationsService';
import NotificationItem from '@/modules/notifications/components/NotificationItem';

export default function NotificationsScreen({ navigation }) {
  const { notifications, unreadCount, markAllAsRead, markAsRead } = useNotificationsStore();
  const [selectedType, setSelectedType] = useState('all');
  const [items, setItems] = useState(notifications);

  useEffect(() => {
    setItems(notifications);
  }, [notifications]);

  useEffect(() => {
    let isActive = true;

    const loadNotifications = async () => {
      const data = await notificationsService.getNotifications();
      if (isActive) {
        setItems(data);
      }
    };

    loadNotifications();

    return () => {
      isActive = false;
    };
  }, []);

  const filteredItems = useMemo(() => {
    if (selectedType === 'all') {
      return items;
    }

    return items.filter((item) => item.type === selectedType);
  }, [items, selectedType]);

  const tabTypes = useMemo(() => ['all', 'info', 'announcement', 'reminder'], []);

  const handleSelect = useCallback((item) => {
    markAsRead(item.id);
    navigation.navigate('NotificationDetails', { notification: item });
  }, [markAsRead, navigation]);

  const handleSelectType = useCallback((type) => {
    setSelectedType(type);
  }, []);

  const renderItem = useCallback(({ item }) => <NotificationItem item={item} onPress={handleSelect} />, [handleSelect]);
  const renderSeparator = useCallback(() => <View className="h-3" />, []);

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-row items-center justify-between px-5 py-4">
        <View>
          <Text className="text-2xl font-semibold text-slate-900">Notifications</Text>
          <Text className="text-sm text-slate-500">{unreadCount} unread updates</Text>
        </View>
        <Pressable onPress={markAllAsRead} className="rounded-full bg-slate-900 px-3 py-2">
          <Text className="text-sm font-medium text-white">Mark all read</Text>
        </Pressable>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-5 pb-2">
        <View className="flex-row gap-2">
          {tabTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => handleSelectType(type)}
              className={`rounded-full px-3 py-2 ${selectedType === type ? 'bg-blue-600' : 'bg-white'}`}
            >
              <Text className={`text-sm ${selectedType === type ? 'text-white' : 'text-slate-700'}`}>
                {type === 'all' ? 'All' : type.charAt(0).toUpperCase() + type.slice(1)}
              </Text>
            </Pressable>
          ))}
        </View>
      </ScrollView>

      <FlatList
        data={filteredItems}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 }}
        renderItem={renderItem}
        ItemSeparatorComponent={renderSeparator}
        initialNumToRender={6}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
      />
    </SafeAreaView>
  );
}
