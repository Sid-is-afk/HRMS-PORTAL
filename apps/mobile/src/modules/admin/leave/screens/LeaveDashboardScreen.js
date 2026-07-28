import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import AdminLayout from '../../components/AdminLayout';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { List, CheckSquare, Briefcase } from 'lucide-react-native';

export default function LeaveDashboardScreen() {
  const navigation = useNavigation();

  return (
    <AdminLayout title="Leave Admin">
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage leave requests, view employee balances, and handle approvals.
        </Text>
        
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 16 }}>
          <View style={{ flexGrow: 1, flexBasis: '30%', minWidth: 250 }}>
            <Button 
              title="Leave Directory" 
              onPress={() => navigation.navigate('LeaveDirectory')} 
              icon={<List size={20} color="white" />}
            />
          </View>

          <View style={{ flexGrow: 1, flexBasis: '30%', minWidth: 250 }}>
            <Button 
              title="Approval Queue" 
              onPress={() => navigation.navigate('AdminApprovalQueue')} 
              styleClass="bg-warning"
              icon={<CheckSquare size={20} color="white" />}
            />
          </View>

          <View style={{ flexGrow: 1, flexBasis: '30%', minWidth: 250 }}>
            <Button 
              title="Leave Balances" 
              onPress={() => navigation.navigate('LeaveBalanceSummary')} 
              styleClass="bg-secondary"
              icon={<Briefcase size={20} color="white" />}
            />
          </View>
        </View>
      </ScrollView>
    </AdminLayout>
  );
}
