import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from './validation/authSchema';
import { TextInput } from '@/components/TextInput';
import { PasswordInput } from '@/components/PasswordInput';
import { Button } from '@/components/Button';
import { ErrorMessage } from '@/components/ErrorMessage';
import { LoadingOverlay } from '@/components/LoadingOverlay';
import { authService } from './api/authService';
import { useAuthStore } from './store/authStore';

export default function Login() {
  const { setTokens, setUser, setLoading, setError, isLoading, error } = useAuthStore();
  const { control, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    setError(null);
    try {
      const response = await authService.login(data.identifier, data.password);
      // Assuming response has { accessToken, refreshToken, user }
      setTokens(response.accessToken, response.refreshToken);
      setUser(response.user);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.error?.message || 'Network error. Please try again later.');
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      className="flex-1 bg-white" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-12">
          
          <View className="mb-10 items-center">
            <Text className="text-primary text-3xl font-bold font-inter mb-2">HRMS Portal</Text>
            <Text className="text-textSecondary text-base font-inter text-center">
              Sign in to manage your attendance and leaves
            </Text>
          </View>

          <ErrorMessage message={error} />

          <Controller
            control={control}
            name="identifier"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email or Employee ID"
                placeholder="Enter your email or ID"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.identifier?.message}
                autoCapitalize="none"
                keyboardType="email-address"
                accessible={true}
                accessibilityLabel="Email or Employee ID input"
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur, value } }) => (
              <PasswordInput
                label="Password"
                placeholder="Enter your password"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.password?.message}
                accessible={true}
                accessibilityLabel="Password input"
              />
            )}
          />

          <View className="mt-4">
            <Button 
              title="Sign In" 
              onPress={handleSubmit(onSubmit)} 
              loading={isLoading}
              styleClass="w-full"
            />
          </View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
