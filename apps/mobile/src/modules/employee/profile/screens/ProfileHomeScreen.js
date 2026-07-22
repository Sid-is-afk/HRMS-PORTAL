import React, { useEffect } from 'react';
import { View, Text, ScrollView, RefreshControl } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useProfile } from '../hooks/useProfile';
import { useEmploymentDetails } from '../hooks/useEmploymentDetails';
import { ProfileHeader } from '../components/ProfileHeader';
import { InfoCard } from '../components/InfoCard';
import { DetailRow } from '../components/DetailRow';
import { ErrorMessage } from '@/shared/components/ErrorMessage';
import { LoadingOverlay } from '@/shared/components/LoadingOverlay';
import { Button } from '@/shared/components/Button';
import { TopHeader } from '@/shared/components/TopHeader';
import { Briefcase, Contact, RefreshCcw, LogOut } from 'lucide-react-native';

export default function ProfileHomeScreen() {
  const navigation = useNavigation();
  const { profile, isLoading, isRefreshing, error, refreshProfile } = useProfile();
  const { employmentDetails } = useEmploymentDetails();

  return (
    <View style={{ flex: 1 }} className="bg-surface">
      <View className="bg-white">
        <TopHeader />
      </View>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        stickyHeaderIndices={[0]}
        refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={refreshProfile} />}
      >
        <LoadingOverlay visible={isLoading && !profile} />
        <View className="p-4 pt-6">
          {error ? <ErrorMessage message={error} /> : null}
          
          <ProfileHeader profile={profile} onEditPress={() => navigation.navigate('EditProfile')} />

          <InfoCard title="Professional Details" icon={Briefcase}>
            <DetailRow label="Employee ID" value={employmentDetails?.employeeId || profile?.employeeId} />
            <DetailRow label="Department" value={employmentDetails?.department || profile?.department} />
            <DetailRow label="Branch" value="New York HQ" />
            <DetailRow label="Reporting Manager" value={employmentDetails?.managerName || profile?.managerName} />
            <DetailRow label="Joining Date" value={employmentDetails?.joiningDate} isLast={true} />
          </InfoCard>

          <InfoCard title="Contact Information" icon={Contact}>
            <DetailRow label="Email Address" value={profile?.email} />
            <DetailRow label="Phone Number" value={profile?.phone} />
            <DetailRow label="Emergency Contact" value="Jamie Johnson (Spouse)\n+1 (555) 987-6543" isLast={true} />
          </InfoCard>

          <View className="mt-4 mb-2">
            <Button 
              title="Change Password" 
              variant="outline" 
              onPress={() => navigation.navigate('ChangePassword')}
              styleClass="mb-4"
              icon={<RefreshCcw size={18} color="#2563EB" className="mr-2" />}
            />
            <Button 
              title="Logout" 
              variant="outline" 
              onPress={() => navigation.navigate('LogoutConfirmation')}
              styleClass="border-error"
              textClass="text-error"
              icon={<LogOut size={18} color="#DC2626" className="mr-2" />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

