import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, Card } from 'react-native-paper';
import EmployeeAvatar from './EmployeeAvatar';
import EmployeeStatusBadge from './EmployeeStatusBadge';

export default function EmployeeCard({ employee, onPress }) {
  const { firstName, lastName, email, status, employment } = employee;

  return (
    <Card style={styles.card}>
      <TouchableOpacity style={styles.container} onPress={onPress}>
        <EmployeeAvatar photoUrl={employee.photoUrl} firstName={firstName} lastName={lastName} size={48} />
        <View style={styles.info}>
          <Text style={styles.name}>{`${firstName} ${lastName}`}</Text>
          <Text style={styles.title}>{employment.designation.title} • {employment.department.name}</Text>
          <Text style={styles.email}>{email}</Text>
        </View>
        <EmployeeStatusBadge status={status} />
      </TouchableOpacity>
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
    marginBottom: 10,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
  },
  info: {
    flex: 1,
    marginLeft: 12,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1F2937',
  },
  title: {
    fontSize: 12,
    color: '#4B5563',
    marginTop: 2,
  },
  email: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 2,
  },
});
