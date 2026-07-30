import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

export default function AdminHeader({ title, onToggleSidebar, showBack }) {
  const navigation = useNavigation();
  const canGoBack = showBack !== false && navigation.canGoBack();

  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.header}>
      <View style={styles.titleContainer}>
        <IconButton icon="menu" iconColor="#1F2937" size={24} onPress={onToggleSidebar} />
        {canGoBack && (
          <IconButton icon="arrow-left" iconColor="#1F2937" size={24} onPress={handleBack} />
        )}
        <Text style={styles.title}>{title}</Text>
      </View>
      <View style={styles.actions}>
        <IconButton icon="bell" iconColor="#1F2937" size={24} onPress={() => navigation.navigate('Notifications')} />
        <IconButton icon="account-circle" iconColor="#1F2937" size={24} onPress={() => navigation.navigate('ProfileHome')} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    height: 56,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  actions: {
    flexDirection: 'row',
  },
});
