import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text, Chip } from 'react-native-paper';

export default function LocationCard({ location }) {
  const { name, type, region, timezone, country, city } = location;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.name}>{name}</Text>
          <Chip style={styles.typeBadge}>{type}</Chip>
        </View>
        <Text style={styles.region}>Region: {region} • Timezone: {timezone}</Text>
        <Text style={styles.address}>{city}, {country}</Text>
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 10,
  },
  content: {
    padding: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
    flex: 1,
  },
  typeBadge: {
    backgroundColor: '#F3F4F6',
    height: 24,
    borderRadius: 6,
  },
  region: {
    fontSize: 11,
    color: '#6B7280',
    marginBottom: 4,
  },
  address: {
    fontSize: 12,
    color: '#4B5563',
    fontWeight: '600',
  },
});
