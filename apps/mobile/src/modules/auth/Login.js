import React from 'react';
import { View, Text, KeyboardAvoidingView, Platform, ScrollView, TouchableOpacity } from 'react-native';
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
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Building2, User as UserIcon, Lock } from 'lucide-react-native';

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
      className="flex-1 bg-surface" 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <LoadingOverlay visible={isLoading} />
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <View className="flex-1 justify-center px-6 py-12">
          
          <Animated.View entering={FadeInDown.duration(600).springify()}>
            <View className="mb-8 items-center">
              <View className="w-16 h-16 bg-primary rounded-2xl items-center justify-center mb-6 shadow-md">
                <Building2 color="#FFFFFF" size={32} />
              </View>
              <Text className="text-primary text-3xl font-bold font-inter mb-2 tracking-tight">WorkForce</Text>
              <Text className="text-textSecondary text-base font-inter text-center">
                Sign in to your account
              </Text>
            </View>

            <View className="bg-white p-6 rounded-2xl shadow-sm border border-border">
              <ErrorMessage message={error} />

              <Controller
                control={control}
                name="identifier"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    label="Email or Phone"
                    placeholder="Enter your email or phone"
                    icon={UserIcon}
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
                  <View className="mb-2 relative">
                    <View className="absolute right-0 top-0 z-10">
                      <TouchableOpacity activeOpacity={0.6} className="py-1">
                        <Text className="text-primary text-xs font-inter font-semibold">Forgot Password?</Text>
                      </TouchableOpacity>
                    </View>
                    <PasswordInput
                      label="Password"
                      placeholder="Enter your password"
                      icon={Lock}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      error={errors.password?.message}
                      accessible={true}
                      accessibilityLabel="Password input"
                    />
                  </View>
                )}
              />

              <View className="mt-4">
                <Button 
                  title="Login" 
                  onPress={handleSubmit(onSubmit)} 
                  loading={isLoading}
                  styleClass="w-full"
                />
              </View>
              
              <View className="mt-6 flex-row justify-center items-center">
                <Text className="text-textSecondary text-sm font-inter">Don't have an account? </Text>
                <TouchableOpacity activeOpacity={0.6}>
                  <Text className="text-primary text-sm font-inter font-semibold">Contact HR</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Animated.View>

        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
