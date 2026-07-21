import React, { useCallback, useEffect } from 'react';
import { View, Text, FlatList, RefreshControl } from 'react-native';
import { useAttendanceStore } from '../store/attendanceStore';
import { AttendanceHistoryItem } from '../components/AttendanceHistoryItem';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingOverlay } from '@/components/LoadingOverlay';

export default function AttendanceHistoryScreen() {
  const { history, isLoading, isRefreshing, error, fetchHistory } = useAttendanceStore();

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const renderEmpty = useCallback(() => {
    if (isLoading && !isRefreshing) return null;
    return (
      <View className="p-8 items-center justify-center">
        <Text className="text-textSecondary font-inter">No attendance history found.</Text>
      </View>
    );
  }, [isLoading, isRefreshing]);

  const renderItem = useCallback(({ item }) => <AttendanceHistoryItem record={item} />, []);
  const keyExtractor = useCallback((item) => item.id, []);
  const handleRefresh = useCallback(() => fetchHistory(true), [fetchHistory]);

  return (
    <View className="flex-1 bg-surface">
      <LoadingOverlay visible={isLoading && !isRefreshing} />
      
      {error ? (
        <View className="p-4">
          <ErrorMessage message={error} />
        </View>
      ) : null}

      <FlatList
        data={history}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        contentContainerStyle={{ padding: 16 }}
        ListEmptyComponent={renderEmpty}
        initialNumToRender={8}
        maxToRenderPerBatch={6}
        windowSize={5}
        removeClippedSubviews
        refreshControl={
          <RefreshControl 
            refreshing={isRefreshing} 
            onRefresh={handleRefresh}
          />
        }
      />
    </View>
  );
}
