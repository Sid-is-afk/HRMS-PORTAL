import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Card, Text } from 'react-native-paper';
import EmployeeAvatar from './EmployeeAvatar';
import EmployeeStatusBadge from './EmployeeStatusBadge';

export default function EmployeeProfileCard({ employee }) {
  const { firstName, lastName, email, phone, status, employment } = employee;

  return (
    <Card style={styles.card}>
      <Card.Content style={styles.content}>
        <EmployeeAvatar photoUrl={employee.photoUrl} firstName={firstName} lastName={lastName} size={80} style={styles.avatar} />
        <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
        <Text style={styles.title}>{employment.designation.title}</Text>
        <Text style={styles.department}>{employment.department.name}</Text>
        <View style={styles.badgeRow}>
          <EmployeeStatusBadge status={status} />
        </View>
        <View style={styles.contactInfo}>
          <Text style={styles.meta}>{email}</Text>
          <Text style={styles.meta}>{phone}</Text>
        </View>
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
    marginBottom: 16,
  },
  content: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  avatar: {
    marginBottom: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: '#1F2937',
  },
  title: {
    fontSize: 14,
    color: '#4B5563',
    fontWeight: '600',
    marginTop: 4,
  },
  department: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  badgeRow: {
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  contactInfo: {
    marginTop: 16,
    alignItems: 'center',
  },
  meta: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
