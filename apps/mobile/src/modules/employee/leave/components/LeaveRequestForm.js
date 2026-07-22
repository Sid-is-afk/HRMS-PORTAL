import React from 'react';
import { View, Text, Switch, TouchableOpacity } from 'react-native';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { leaveApplicationSchema } from '../validation/leaveSchema';
import { TextInput } from '@/shared/components/TextInput';
import { Button } from '@/shared/components/Button';

export function LeaveRequestForm({ leaveTypes, onSubmit, isSubmitting }) {
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(leaveApplicationSchema),
    defaultValues: {
      leaveType: '',
      startDate: '',
      endDate: '',
      halfDay: false,
      reason: '',
    },
  });

  return (
    <View className="bg-white p-4 rounded-2xl border border-border">
      <Text className="text-textPrimary font-semibold text-lg mb-4">Apply for Leave</Text>

      <Controller
        control={control}
        name="leaveType"
        render={({ field: { onChange, value } }) => (
          <View className="mb-4">
            <Text className="text-textSecondary text-sm mb-2">Leave Type</Text>
            {leaveTypes.map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => onChange(item.id)}
                className={`p-3 mb-2 rounded-xl border ${value === item.id ? 'border-primary bg-primary/10' : 'border-border'}`}
              >
                <Text className="text-textPrimary font-medium">{item.label}</Text>
                <Text className="text-textSecondary text-xs mt-1">{item.description}</Text>
              </TouchableOpacity>
            ))}
            {errors.leaveType ? <Text className="text-error text-xs mt-1">{errors.leaveType.message}</Text> : null}
          </View>
        )}
      />

      <Controller
        control={control}
        name="startDate"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Start Date"
            placeholder="YYYY-MM-DD"
            value={value}
            onChangeText={onChange}
            error={errors.startDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="endDate"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="End Date"
            placeholder="YYYY-MM-DD"
            value={value}
            onChangeText={onChange}
            error={errors.endDate?.message}
          />
        )}
      />

      <Controller
        control={control}
        name="halfDay"
        render={({ field: { onChange, value } }) => (
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-textPrimary font-medium">Half Day</Text>
              <Text className="text-textSecondary text-sm">Request a half-day leave</Text>
            </View>
            <Switch value={value} onValueChange={onChange} />
          </View>
        )}
      />

      <Controller
        control={control}
        name="reason"
        render={({ field: { onChange, value } }) => (
          <TextInput
            label="Reason"
            placeholder="Briefly explain your request"
            value={value}
            onChangeText={onChange}
            multiline
            styleClass="h-24"
            error={errors.reason?.message}
          />
        )}
      />

      <Button title="Submit Leave Request" loading={isSubmitting} onPress={handleSubmit(onSubmit)} />
    </View>
  );
}
