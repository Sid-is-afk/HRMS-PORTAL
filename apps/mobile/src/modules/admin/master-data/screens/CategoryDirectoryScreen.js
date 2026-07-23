import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AdminLayout from '../../components/AdminLayout';
import { useMasterData } from '../hooks/useMasterData';
import { MasterDataCard } from '../components/MasterDataCard';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import SkeletonDashboard from '../../components/SkeletonDashboard';

export default function CategoryDirectoryScreen() {
  const navigation = useNavigation();
  const { categories, isLoading, error, selectCategory } = useMasterData();

  const handleSelectCategory = (categoryId) => {
    selectCategory(categoryId);
    navigation.navigate('CategoryDetails', { categoryId });
  };

  return (
    <AdminLayout title="Configuration Categories">
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>All Configurations Directory</Text>
          <Text style={styles.subtitle}>
            Browse and inspect all reference categories and database seed parameters.
          </Text>
        </View>

        {error ? <ErrorMessage message={error} /> : null}

        {isLoading && categories.length === 0 ? (
          <SkeletonDashboard />
        ) : (
          <ScrollView contentContainerStyle={styles.list}>
            <View style={styles.grid}>
              {categories.map((cat) => (
                <View key={cat.id} style={styles.gridItem}>
                  <MasterDataCard
                    category={cat}
                    onPress={() => handleSelectCategory(cat.id)}
                  />
                </View>
              ))}
            </View>
          </ScrollView>
        )}
      </View>
    </AdminLayout>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  list: {
    padding: 16,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -8,
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: 8,
  },
});
