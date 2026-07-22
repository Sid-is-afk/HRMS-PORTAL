import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useProfileStore } from '@/modules/employee/profile/store/profileStore';
import { profileUpdateSchema } from '../validation/profileSchema';
import { TextInput } from '@/shared/components/TextInput';
import { Button } from '@/shared/components/Button';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function EditProfileScreen() {
  const { profile, updateProfile, isSubmitting, error } = useProfileStore();

  const { control, handleSubmit } = useForm({
    resolver: zodResolver(profileUpdateSchema),
    defaultValues: {
      firstName: profile?.firstName || '',
      lastName: profile?.lastName || '',
      phone: profile?.phone || '',
      address: profile?.address || '',
      location: profile?.location || '',
    },
  });

  const submitProfile = async (values) => {
    try {
      await updateProfile(values);
    } catch {
      // Error handled in store
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="p-4">
        <Text className="text-textPrimary text-3xl font-bold mb-2">Edit Profile</Text>
        <Text className="text-textSecondary mb-4">Update your personal details.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <Controller
          control={control}
          name="firstName"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="First Name" value={value} onChangeText={onChange} error={fieldError?.message} />
          )}
        />

        <Controller
          control={control}
          name="lastName"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="Last Name" value={value} onChangeText={onChange} error={fieldError?.message} />
          )}
        />

        <Controller
          control={control}
          name="phone"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="Phone" value={value} onChangeText={onChange} error={fieldError?.message} />
          )}
        />

        <Controller
          control={control}
          name="address"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="Address" value={value} onChangeText={onChange} error={fieldError?.message} />
          )}
        />

        <Controller
          control={control}
          name="location"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="Location" value={value} onChangeText={onChange} error={fieldError?.message} />
          )}
        />

        <Button title="Save Changes" loading={isSubmitting} onPress={handleSubmit(submitProfile)} />
      </View>
    </ScrollView>
  );
}
