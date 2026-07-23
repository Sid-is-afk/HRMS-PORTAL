import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Menu, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { roleAssignmentSchema } from '../validation/iamSchema';
import { Button } from '@/shared/components/Button';

export function RoleAssignmentPanel({ roles, employees, onSubmit, onCancel, isLoading }) {
  const [employeeMenuVisible, setEmployeeMenuVisible] = useState(false);
  const [roleMenuVisible, setRoleMenuVisible] = useState(false);

  const {
    control,
    handleSubmit,
    setValue,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(roleAssignmentSchema),
    defaultValues: {
      employeeId: '',
      roleId: '',
    },
  });

  const handleFormSubmit = (data) => {
    onSubmit?.(data.employeeId, data.roleId);
    reset();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Assign User Role</Text>

      {/* Select Employee */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>1. Select Employee</Text>
        <Controller
          control={control}
          name="employeeId"
          render={({ field: { value } }) => {
            const selectedEmployee = employees.find(e => e.id === value);
            return (
              <Menu
                visible={employeeMenuVisible}
                onDismiss={() => setEmployeeMenuVisible(false)}
                anchor={
                  <Button
                    title={selectedEmployee ? `${selectedEmployee.firstName} ${selectedEmployee.lastName} (${selectedEmployee.email})` : 'Choose Employee...'}
                    variant="outline"
                    onPress={() => setEmployeeMenuVisible(true)}
                    style={styles.pickerButton}
                  />
                }
              >
                {employees.map((emp) => (
                  <Menu.Item
                    key={emp.id}
                    onPress={() => {
                      setValue('employeeId', emp.id);
                      setEmployeeMenuVisible(false);
                    }}
                    title={`${emp.firstName} ${emp.lastName}`}
                  />
                ))}
              </Menu>
            );
          }}
        />
        {errors.employeeId && (
          <HelperText type="error" visible={true}>
            {errors.employeeId.message}
          </HelperText>
        )}
      </View>

      {/* Select Role */}
      <View style={styles.formGroup}>
        <Text style={styles.label}>2. Assign Target Role</Text>
        <Controller
          control={control}
          name="roleId"
          render={({ field: { value } }) => {
            const selectedRole = roles.find(r => r.id === value);
            return (
              <Menu
                visible={roleMenuVisible}
                onDismiss={() => setRoleMenuVisible(false)}
                anchor={
                  <Button
                    title={selectedRole ? `${selectedRole.name} (${selectedRole.code})` : 'Choose Role...'}
                    variant="outline"
                    onPress={() => setRoleMenuVisible(true)}
                    style={styles.pickerButton}
                  />
                }
              >
                {roles.filter(r => r.status === 'ACTIVE').map((role) => (
                  <Menu.Item
                    key={role.id}
                    onPress={() => {
                      setValue('roleId', role.id);
                      setRoleMenuVisible(false);
                    }}
                    title={role.name}
                  />
                ))}
              </Menu>
            );
          }}
        />
        {errors.roleId && (
          <HelperText type="error" visible={true}>
            {errors.roleId.message}
          </HelperText>
        )}
      </View>

      <View style={styles.actions}>
        {onCancel && (
          <Button
            title="Cancel"
            variant="outline"
            onPress={onCancel}
            style={styles.btn}
            disabled={isLoading}
          />
        )}
        <Button
          title="Grant Access Role"
          onPress={handleSubmit(handleFormSubmit)}
          style={styles.btn}
          loading={isLoading}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    padding: 16,
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 16,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#4B5563',
    marginBottom: 6,
  },
  pickerButton: {
    alignItems: 'flex-start',
    width: '100%',
    borderColor: '#D1D5DB',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 12,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 16,
  },
  btn: {
    minWidth: 120,
  },
});
