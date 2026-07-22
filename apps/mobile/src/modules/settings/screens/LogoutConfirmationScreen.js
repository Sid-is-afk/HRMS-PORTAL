import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuthStore } from '@/modules/auth/store/authStore';
import { useSettings } from '../hooks/useSettings';
import { ErrorMessage } from '@/components/ErrorMessage';

export default function LogoutConfirmationScreen() {
  const navigation = useNavigation();
  const logoutAction = useAuthStore((state) => state.logoutAction);
  const { logout, error } = useSettings();

  const handleLogout = async () => {
    try {
      await logout();
      useAuthStore.getState().logoutAction();
    } catch (err) {
      // error handled by store
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <View className="flex-1 items-center justify-center px-6">
        <View className="w-full rounded-2xl border border-slate-200 bg-white p-6">
          <Text className="text-center text-2xl font-semibold text-slate-900">Logout</Text>
          <Text className="mt-2 text-center text-sm text-slate-500">Are you sure you want to sign out of the app?</Text>
          {error ? <ErrorMessage message={error} /> : null}
          <Pressable onPress={handleLogout} className="mt-4 rounded-xl bg-red-600 p-3">
            <Text className="text-center font-semibold text-white">Sign Out</Text>
          </Pressable>
          <Pressable onPress={() => navigation.goBack()} className="mt-3 rounded-xl border border-slate-200 p-3">
            <Text className="text-center font-semibold text-slate-700">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}
