import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { employeeCreateSchema, employeeEditSchema } from '../validation/employeeSchema';
import { useEmployeeManagementStore } from '../store/employeeManagementStore';
import { useCallback } from 'react';

export function useEmployeeForm(employee = null) {
  const { createEmployee, updateEmployee, isLoading, error } = useEmployeeManagementStore(
    (state) => ({
      createEmployee: state.createEmployee,
      updateEmployee: state.updateEmployee,
      isLoading: state.isLoading,
      error: state.error,
    })
  );

  const isEditMode = !!employee;
  const schema = isEditMode ? employeeEditSchema : employeeCreateSchema;

  const defaultValues = {
    firstName: employee?.firstName || '',
    lastName: employee?.lastName || '',
    email: employee?.email || '',
    phone: employee?.phone || '',
    employeeId: employee?.employment?.employeeId || '',
    type: employee?.employment?.type || 'FULL_TIME',
    joiningDate: employee?.employment?.joiningDate || '',
    departmentId: employee?.employment?.department?.id || '',
    designationId: employee?.employment?.designation?.id || '',
    role: employee?.employment?.role || 'EMPLOYEE',
    managerId: employee?.employment?.manager?.id || '',
    emergencyContact: {
      name: employee?.emergencyContact?.name || '',
      relationship: employee?.emergencyContact?.relationship || '',
      phone: employee?.emergencyContact?.phone || '',
    },
    ...(isEditMode ? { status: employee?.status || 'ACTIVE' } : {}),
  };

  const methods = useForm({
    resolver: zodResolver(schema),
    defaultValues,
  });

  const onSubmit = useCallback(
    async (values) => {
      if (isEditMode) {
        return await updateEmployee(employee.id, values);
      } else {
        return await createEmployee(values);
      }
    },
    [isEditMode, employee, createEmployee, updateEmployee]
  );

  return {
    ...methods,
    isEditMode,
    isLoading,
    submitError: error,
    submit: methods.handleSubmit(onSubmit),
  };
}
