import React from 'react';
import { View, FlatList, Text, TextInput } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { OfferCard } from '../components/OfferCard';
import { useOffers } from '../hooks/useOffers';
import { useOfferStore } from '../store/offerStore';
import { useNavigation } from '@react-navigation/native';
import { Search } from 'lucide-react-native';

export default function OfferDirectoryScreen() {
  const { offers, isLoading, error } = useOffers();
  const { searchQuery, setSearchQuery } = useOfferStore();
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Offers" showBack={true} />
      <LoadingOverlay visible={isLoading} />
      
      <View className="p-4 border-b border-border bg-white">
        <View className="flex-row items-center bg-surface px-3 py-2 rounded-lg border border-border">
          <Search size={20} color="#64748B" />
          <TextInput
            className="flex-1 ml-2 font-inter text-base text-textPrimary"
            placeholder="Search candidates or jobs..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {error ? (
        <View className="p-4"><Text className="text-error">{error}</Text></View>
      ) : null}

      <FlatList
        data={offers}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <OfferCard 
            offer={item} 
            onPress={() => navigation.navigate('OfferDetails', { offerId: item.id })}
          />
        )}
        ListEmptyComponent={
          !isLoading ? (
            <View className="items-center justify-center py-10">
              <Text className="text-textSecondary">No offers found.</Text>
            </View>
          ) : null
        }
      />
    </View>
  );
}
