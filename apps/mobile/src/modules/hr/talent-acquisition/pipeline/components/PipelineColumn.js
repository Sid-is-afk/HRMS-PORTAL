import React from 'react';
import { View, StyleSheet, FlatList } from 'react-native';
import { Text } from 'react-native-paper';
import PipelineCard from './PipelineCard';

export default function PipelineColumn({ stage, onCandidatePress, onMoveCandidate }) {
  const { label, candidates = [], color } = stage;

  return (
    <View style={styles.columnContainer}>
      <View style={styles.header}>
        <View style={styles.titleRow}>
          <View style={[styles.indicator, { backgroundColor: color }]} />
          <Text style={styles.title}>{label}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{candidates.length}</Text>
        </View>
      </View>

      <FlatList\n        initialNumToRender={10}\n        maxToRenderPerBatch={10}\n        windowSize={5}
        data={candidates}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <PipelineCard
            candidate={item}
            onPress={() => onCandidatePress(item)}
            onMoveStage={() => onMoveCandidate(item)}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyText}>Empty</Text>
          </View>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  columnContainer: {
    width: 280,
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    marginRight: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    height: '100%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 4,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  indicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  badge: {
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#4B5563',
  },
  listContainer: {
    flexGrow: 1,
    paddingBottom: 24,
  },
  empty: {
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: '#D1D5DB',
    borderRadius: 8,
  },
  emptyText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
});
