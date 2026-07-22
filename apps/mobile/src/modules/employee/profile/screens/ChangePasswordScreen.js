import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useChangePassword } from '../hooks/useChangePassword';
import { passwordChangeSchema } from '../validation/profileSchema';
import { TextInput } from '@/shared/components/TextInput';
import { Button } from '@/shared/components/Button';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function ChangePasswordScreen() {
  const { submitPasswordChange, isSubmitting, error } = useChangePassword();

  const { control, handleSubmit, reset } = useForm({
    resolver: zodResolver(passwordChangeSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (values) => {
    try {
      await submitPasswordChange(values);
      reset();
    } catch {
      // Error handled in hook
    }
  };

  return (
    <ScrollView className="flex-1 bg-surface">
      <View className="p-4">
        <Text className="text-textPrimary text-3xl font-bold mb-2">Change Password</Text>
        <Text className="text-textSecondary mb-4">Update your password securely.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <Controller
          control={control}
          name="currentPassword"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="Current Password" value={value} onChangeText={onChange} secureTextEntry error={fieldError?.message} />
          )}
        />

        <Controller
          control={control}
          name="newPassword"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="New Password" value={value} onChangeText={onChange} secureTextEntry error={fieldError?.message} />
          )}
        />

        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { onChange, value }, fieldState: { error: fieldError } }) => (
            <TextInput label="Confirm New Password" value={value} onChangeText={onChange} secureTextEntry error={fieldError?.message} />
          )}
        />

        <Button title="Update Password" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
      </View>
    </ScrollView>
  );
}
