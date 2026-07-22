import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Card, Avatar } from 'react-native-paper';

export default function ApproverList({ approvers = [] }) {
  return (
    <Card style={styles.card}>
      <Card.Title title="Designated Approver Routing" titleStyle={styles.title} />
      <Card.Content>
        {approvers.map((item) => (
          <View key={item.id} style={styles.row}>
            <Avatar.Text size={32} label={item.firstName.charAt(0).toUpperCase()} style={styles.avatar} />
            <View style={styles.info}>
              <Text style={styles.name}>
                {item.firstName} {item.lastName}
              </Text>
              <Text style={styles.role}>{item.role || 'System Approver'}</Text>
            </View>
          </View>
        ))}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    elevation: 0,
    marginBottom: 12,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1F2937',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    backgroundColor: '#3B82F6',
  },
  info: {
    marginLeft: 12,
  },
  name: {
    fontSize: 13,
    fontWeight: '700',
    color: '#374151',
  },
  role: {
    fontSize: 11,
    color: '#6B7280',
  },
});
