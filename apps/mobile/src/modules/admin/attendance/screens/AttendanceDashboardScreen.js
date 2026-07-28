import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { List, Calendar, AlertCircle } from 'lucide-react-native';

export default function AttendanceDashboardScreen() {
  const navigation = useNavigation();

  return (
    <AdminLayout title="Attendance Admin">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Monitor employee attendance, exceptions, and regularization requests.
        </Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flexGrow: 1, flexBasis: '30%', minWidth: 250 }}>
            <Button 
              title="Attendance Directory" 
              onPress={() => navigation.navigate('AttendanceDirectory')} 
              icon={<List size={20} color="white" />}
            />
          </View>

          <View style={{ flexGrow: 1, flexBasis: '30%', minWidth: 250 }}>
            <Button 
              title="Exceptions & Alerts" 
              onPress={() => {}} 
              styleClass="bg-warning"
              icon={<AlertCircle size={20} color="white" />}
            />
          </View>

          <View style={{ flexGrow: 1, flexBasis: '30%', minWidth: 250 }}>
            <Button 
              title="Regularization Queue" 
              onPress={() => navigation.navigate('AdminApprovalQueue')} 
              styleClass="bg-secondary"
              icon={<Calendar size={20} color="white" />}
            />
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}
