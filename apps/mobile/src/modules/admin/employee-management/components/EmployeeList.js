import React from 'react';
import { FlatList, ActivityIndicator, View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import EmployeeCard from './EmployeeCard';

export default function EmployeeList({ employees, refreshing, onRefresh, onEndReached, hasMore, onPressItem }) {
  if (!employees || employees.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No employees found matching the filters.</Text>
      </View>
    );
  }

  const renderFooter = () => {
    if (!hasMore) return null;
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color="#3B82F6" />
      </View>
    );
  };

  return (
    <FlatList
      data={employees}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <EmployeeCard employee={item} onPress={() => onPressItem(item.id)} />
      )}
      refreshing={refreshing}
      onRefresh={onRefresh}
      onEndReached={onEndReached}
      onEndReachedThreshold={0.3}
      ListFooterComponent={renderFooter}
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
  footer: {
    paddingVertical: 16,
    alignItems: 'center',
  },
});
