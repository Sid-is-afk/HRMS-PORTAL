import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { List, Calendar, AlertCircle } from 'lucide-react-native';

export default function AttendanceDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Attendance Admin" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Monitor employee attendance, exceptions, and regularization requests.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Attendance Directory" 
            onPress={() => navigation.navigate('AttendanceDirectory')} 
            icon={<List size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Exceptions & Alerts" 
            onPress={() => {}} 
            styleClass="bg-warning"
            icon={<AlertCircle size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Regularization Queue" 
            onPress={() => navigation.navigate('AdminApprovalQueue')} 
            styleClass="bg-secondary"
            icon={<Calendar size={20} color="white" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
