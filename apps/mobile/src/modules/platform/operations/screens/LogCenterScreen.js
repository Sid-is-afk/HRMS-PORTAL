import React, { useEffect } from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { LogViewer } from '../components/LogViewer';
import { useOperations } from '../hooks/useOperations';

export default function LogCenterScreen() {
  const { logs, isLoading, error, fetchLogs } = useOperations();

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  return (
    <View className="flex-1 bg-[#1E293B]">
      <TopHeader title="Log Center" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <View className="p-3 bg-[#0F172A]">
        <Text className="text-[#94A3B8] text-xs font-mono">Live Tailing Enabled - platform.prod.logs</Text>
      </View>

      <FlatList
        data={logs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 12 }}
        renderItem={({ item }) => <LogViewer log={item} />}
        initialNumToRender={20}
        maxToRenderPerBatch={20}
        windowSize={10}
      />
    </View>
  );
}
