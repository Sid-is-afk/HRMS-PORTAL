import React from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { Text, Avatar } from 'react-native-paper';

export default function QuickActionCard({ label, icon, onPress, color = '#2563EB', bg = '#EFF6FF' }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={[styles.iconWrapper, { backgroundColor: bg }]}>
        <Avatar.Icon size={32} icon={icon} color={color} style={{ backgroundColor: 'transparent' }} />
      </View>
      <Text style={styles.label}>{label}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    flex: 1,
    minWidth: 100,
    marginBottom: 8,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  label: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '600',
    textAlign: 'center',
  },
});
