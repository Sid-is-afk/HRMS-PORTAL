import React from 'react';
import { FlatList, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import ApprovalCard from './ApprovalCard';

export default function ApprovalQueue({ queue, refreshing, onRefresh, onPressItem }) {
  if (!queue || queue.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No approval requests in the queue.</Text>
      </View>
    );
  }

  return (
    <FlatList
      data={queue}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <ApprovalCard request={item} onPress={() => onPressItem(item.id)} />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      contentContainerStyle={styles.listContainer}
    />
  );
}

const styles = StyleSheet.create({
  listContainer: {
    paddingBottom: 24,
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },
});
