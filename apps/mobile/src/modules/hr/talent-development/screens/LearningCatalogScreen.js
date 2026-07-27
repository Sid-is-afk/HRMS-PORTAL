import React from 'react';
import { View, FlatList, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { LearningCard } from '../components/LearningCard';
import { useTalentDevelopment } from '../hooks/useTalentDevelopment';

export default function LearningCatalogScreen() {
  const { courses, isLoading, error } = useTalentDevelopment();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Learning Catalog" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={courses}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <LearningCard 
            course={item} 
            onPress={() => console.log('Open Course')}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No courses assigned.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
