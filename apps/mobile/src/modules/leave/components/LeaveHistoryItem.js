import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { Clock, CheckCircle2, XCircle } from 'lucide-react-native';
import { Button } from '@/components/Button';

export function LeaveHistoryItem({ item, onPress, isAdmin = false, onApprove, onReject }) {
  const startDate = new Date(item.startDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  const endDate = new Date(item.endDate).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
  
  const statusStr = item.status?.toString().toUpperCase() || '';
  let borderColor = 'border-l-gray-300';
  let badgeColor = 'bg-orange-100';
  let badgeTextColor = 'text-warning';
  let Icon = Clock;

  if (statusStr.includes('APPROVED')) {
    borderColor = 'border-l-success';
    badgeColor = 'bg-green-100';
    badgeTextColor = 'text-success';
    Icon = CheckCircle2;
  } else if (statusStr.includes('REJECTED')) {
    borderColor = 'border-l-error';
    badgeColor = 'bg-red-100';
    badgeTextColor = 'text-error';
    Icon = XCircle;
  } else if (statusStr.includes('PENDING')) {
    borderColor = 'border-l-warning';
  }

  // Calculate days for duration display
  const durationText = item.duration > 1 ? `${item.duration} Days` : `${item.duration} Day`;

  return (
    <TouchableOpacity 
      onPress={onPress} 
      activeOpacity={0.7}
      className={`bg-white border border-border border-l-4 ${borderColor} rounded-2xl mb-4 shadow-sm overflow-hidden`}
    >
      <View className="p-4">
        
        {/* User Info (Admin view) */}
        {isAdmin && item.user && (
          <View className="flex-row items-center mb-4">
            <View className="w-10 h-10 rounded-full bg-surface overflow-hidden mr-3">
              <Image source={{ uri: 'https://ui-avatars.com/api/?name=' + item.user.name }} className="w-full h-full" />
            </View>
            <View className="flex-1">
              <Text className="text-textPrimary font-bold text-base font-inter">{item.user.name}</Text>
              <Text className="text-textSecondary text-xs font-inter">{item.user.role} • {item.user.department}</Text>
            </View>
            <View className={`${badgeColor} px-2 py-1 rounded-md flex-row items-center`}>
              <Icon size={12} color={badgeTextColor === 'text-warning' ? '#F59E0B' : badgeTextColor === 'text-success' ? '#16A34A' : '#DC2626'} />
              <Text className={`${badgeTextColor} text-xs font-bold font-inter ml-1`}>
                {item.status}
              </Text>
            </View>
          </View>
        )}

        {/* Leave Details Box */}
        <View className="bg-surface rounded-xl p-3 flex-row justify-between mb-3 border border-border">
          <View>
            <Text className="text-textSecondary text-xs font-inter mb-1">Leave Type</Text>
            <Text className="text-textPrimary font-semibold font-inter">{item.leaveType}</Text>
          </View>
          <View className="items-end">
            <Text className="text-textSecondary text-xs font-inter mb-1">Duration</Text>
            <Text className="text-textPrimary font-semibold font-inter">{startDate} - {endDate}</Text>
            <Text className="text-textSecondary text-xs font-inter">({durationText})</Text>
          </View>
        </View>

        {/* Reason */}
        <View className="mb-2">
          <Text className="text-textSecondary text-xs font-inter mb-1">Reason provided:</Text>
          <Text className="text-textPrimary text-sm font-inter leading-5">{item.reason}</Text>
        </View>

        {/* Actions (Admin View) */}
        {isAdmin && statusStr.includes('PENDING') && (
          <View className="flex-row gap-2 mt-4 pt-4 border-t border-border">
            <Button 
              title="Reject" 
              variant="secondary" 
              onPress={onReject} 
              styleClass="flex-1 py-2"
            />
            <Button 
              title="Approve" 
              onPress={onApprove} 
              styleClass="flex-1 py-2"
            />
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}
