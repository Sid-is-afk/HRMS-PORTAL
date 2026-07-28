import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Bell, ArrowLeft } from 'lucide-react-native';
import { useNavigation, useRoute } from '@react-navigation/native';

export function TopHeader({ title, showBack }) {
  const navigation = useNavigation();
  const route = useRoute();
  const canGoBack = showBack !== false && navigation.canGoBack();

  const handleBack = () => {
    const mainPages = [
      'AdminEmployeeManagement',
      'AdminAttendance',
      'AdminLeave',
      'AdminDepartments',
      'AdminReports',
      'AdminAnnouncements',
      'AdminSettings',
      'AdminIAM',
      'AdminMasterData',
      'WorkforceOverview'
    ];

    if (mainPages.includes(route.name)) {
      navigation.navigate('AdminDashboard');
    } else {
      navigation.goBack();
    }
  };

  return (
    <View className="flex-row items-center justify-between px-6 py-4 bg-white border-b border-border">
      <View className="flex-row items-center space-x-2">
        {canGoBack ? (
          <TouchableOpacity 
            onPress={handleBack}
            activeOpacity={0.6}
            className="p-2 -ml-2 mr-2"
          >
            <ArrowLeft size={24} color="#111827" />
          </TouchableOpacity>
        ) : (
          /* Placeholder for User Avatar or Company Logo */
          <View className="w-8 h-8 bg-surface rounded-full overflow-hidden mr-2">
             <Image 
               source={{ uri: 'https://ui-avatars.com/api/?name=W+F&background=2563EB&color=fff' }} 
               className="w-full h-full"
             />
          </View>
        )}
        <Text className={`${title ? 'text-textPrimary text-lg' : 'text-primary text-xl'} font-bold font-inter tracking-tight`}>
          {title || "WorkForce"}
        </Text>
      </View>
      <TouchableOpacity 
        onPress={() => navigation.navigate('Notifications')}
        activeOpacity={0.6}
        className="p-2 -mr-2"
      >
        <Bell size={24} color="#111827" />
      </TouchableOpacity>
    </View>
  );
}
