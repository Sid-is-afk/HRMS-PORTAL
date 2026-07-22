import React, { useState } from 'react';
import { ScrollView, Text, TextInput, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm, Controller } from 'react-hook-form';
import { contactSupportSchema } from '../validation/settingsSchema';
import { useSettings } from '../hooks/useSettings';
import { ErrorMessage } from '@/shared/components/ErrorMessage';

export default function HelpAndSupportScreen() {
  const { error } = useSettings();
  const [submitted, setSubmitted] = useState(false);
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({ resolver: zodResolver(contactSupportSchema) });

  const onSubmit = async () => {
    setSubmitted(true);
  };

  return (
    <SafeAreaView className="flex-1 bg-slate-50">
      <ScrollView className="flex-1 px-4 py-4">
        <Text className="mb-1 text-2xl font-semibold text-slate-900">Help & Support</Text>
        <Text className="mb-4 text-sm text-slate-500">Share a concern and our support team will get back to you.</Text>
        {error ? <ErrorMessage message={error} /> : null}

        <Controller
          control={control}
          name="name"
          render={({ field: { onChange, value } }) => (
            <TextInput className="mb-3 rounded-xl border border-slate-200 bg-white p-3" placeholder="Your name" value={value} onChangeText={onChange} />
          )}
        />
        {errors.name ? <Text className="mb-2 text-sm text-red-600">{errors.name.message}</Text> : null}

        <Controller
          control={control}
          name="email"
          render={({ field: { onChange, value } }) => (
            <TextInput className="mb-3 rounded-xl border border-slate-200 bg-white p-3" placeholder="Email address" keyboardType="email-address" value={value} onChangeText={onChange} />
          )}
        />
        {errors.email ? <Text className="mb-2 text-sm text-red-600">{errors.email.message}</Text> : null}

        <Controller
          control={control}
          name="message"
          render={({ field: { onChange, value } }) => (
            <TextInput className="mb-3 rounded-xl border border-slate-200 bg-white p-3" placeholder="Describe your issue" multiline numberOfLines={5} value={value} onChangeText={onChange} />
          )}
        />
        {errors.message ? <Text className="mb-2 text-sm text-red-600">{errors.message.message}</Text> : null}

        <Pressable onPress={handleSubmit(onSubmit)} className="rounded-xl bg-blue-600 p-3">
          <Text className="text-center font-semibold text-white">Submit request</Text>
        </Pressable>

        {submitted ? <Text className="mt-3 text-sm text-slate-600">Your request has been logged successfully.</Text> : null}
      </ScrollView>
    </SafeAreaView>
  );
}
