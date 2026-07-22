import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Chip, Text } from 'react-native-paper';

export default function WorkflowFilters({ selected, onChange, options = [], label }) {
  return (
    <View style={styles.container}>
      {label ? <Text style={styles.label}>{label}</Text> : null}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
        {options.map((item) => (
          <Chip
            key={item.id}
            selected={selected === item.id}
            onPress={() => onChange(item.id)}
            style={styles.chip}
          >
            {item.label}
          </Chip>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 12,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: '#4B5563',
    marginBottom: 6,
  },
  scroll: {
    flexDirection: 'row',
  },
  chip: {
    marginRight: 6,
    backgroundColor: '#F3F4F6',
  },
});
