import React from 'react';
import { View, ScrollView, Text } from 'react-native';
import { TopHeader } from '@/shared/components/TopHeader';
import { useNavigation } from '@react-navigation/native';
import { Button } from '@/shared/components/Button';
import { List, CheckSquare, Briefcase } from 'lucide-react-native';

export default function LeaveDashboardScreen() {
  const navigation = useNavigation();

  return (
    <View className="flex-1 bg-surface">
      <TopHeader title="Leave Admin" showBack={true} />
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        <Text className="text-textSecondary text-sm mb-4">
          Manage leave requests, view employee balances, and handle approvals.
        </Text>
        
        <View className="mb-4">
          <Button 
            title="Leave Directory" 
            onPress={() => navigation.navigate('LeaveDirectory')} 
            icon={<List size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Approval Queue" 
            onPress={() => navigation.navigate('AdminApprovalQueue')} 
            styleClass="bg-warning"
            icon={<CheckSquare size={20} color="white" />}
          />
        </View>

        <View className="mb-4">
          <Button 
            title="Leave Balances" 
            onPress={() => navigation.navigate('LeaveBalanceSummary')} 
            styleClass="bg-secondary"
            icon={<Briefcase size={20} color="white" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
