import React, { useEffect } from 'react';
import { View, FlatList, Text, Alert } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { SessionCard } from '../components/SessionCard';
import { useIdentity } from '../hooks/useIdentity';

export default function SessionCenterScreen() {
  const { sessions, isLoading, error, fetchSessions } = useIdentity();

  useEffect(() => {
    fetchSessions();
  }, [fetchSessions]);

  const handleRevoke = (id) => {
    Alert.alert("Revoke Session", `Revoking session ${id} placeholder action.`);
  };

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Session Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={sessions}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => <SessionCard session={item} onRevoke={handleRevoke} />}
        initialNumToRender={10}
        maxToRenderPerBatch={10}
        windowSize={5}
      />
    </View>
  );
}
