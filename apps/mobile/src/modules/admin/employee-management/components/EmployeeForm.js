import React from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Controller } from 'react-hook-form';
import { Chip, Text, Button } from 'react-native-paper';
import { TextInput } from '@/shared/components/TextInput';

export default function EmployeeForm({
  control,
  errors,
  isEditMode,
  departments = [],
  designations = [],
  managers = [],
  onSubmit,
  isLoading,
}) {
  const types = [
    { id: 'FULL_TIME', label: 'Full Time' },
    { id: 'PART_TIME', label: 'Part Time' },
    { id: 'CONTRACT', label: 'Contract' },
    { id: 'INTERN', label: 'Intern' },
  ];

  const roles = [
    { id: 'EMPLOYEE', label: 'Employee' },
    { id: 'ADMIN', label: 'Admin' },
    { id: 'HR', label: 'HR Admin' },
    { id: 'SUPER_ADMIN', label: 'Super Admin' },
  ];

  const statuses = [
    { id: 'ACTIVE', label: 'Active' },
    { id: 'INACTIVE', label: 'Inactive' },
    { id: 'ON_LEAVE', label: 'On Leave' },
    { id: 'TERMINATED', label: 'Terminated' },
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.sectionTitle}>Basic Information</Text>
      <Controller
        control={control}
        name="firstName"
        render={({ field: { onChange, value } }) => (
          <TextInput label="First Name" value={value} onChangeText={onChange} error={errors.firstName?.message} />
        )}
      />
      <Controller
        control={control}
        name="lastName"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Last Name" value={value} onChangeText={onChange} error={errors.lastName?.message} />
        )}
      />
      <Controller
        control={control}
        name="email"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Email Address" value={value} onChangeText={onChange} error={errors.email?.message} keyboardType="email-address" autoCapitalize="none" />
        )}
      />
      <Controller
        control={control}
        name="phone"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Phone Number" value={value} onChangeText={onChange} error={errors.phone?.message} keyboardType="phone-pad" />
        )}
      />
      <Controller
        control={control}
        name="employeeId"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Employee ID" value={value} onChangeText={onChange} error={errors.employeeId?.message} autoCapitalize="characters" />
        )}
      />

      <Text style={styles.sectionTitle}>Employment Details</Text>
      <Controller
        control={control}
        name="joiningDate"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Joining Date (YYYY-MM-DD)" value={value} onChangeText={onChange} error={errors.joiningDate?.message} placeholder="YYYY-MM-DD" />
        )}
      />

      <Text style={styles.fieldLabel}>Employment Type</Text>
      <Controller
        control={control}
        name="type"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipRow}>
            {types.map((t) => (
              <Chip key={t.id} selected={value === t.id} onPress={() => onChange(t.id)} style={styles.chip}>
                {t.label}
              </Chip>
            ))}
          </View>
        )}
      />
      {errors.type ? <Text style={styles.errorText}>{errors.type.message}</Text> : null}

      <Text style={styles.fieldLabel}>Access Role</Text>
      <Controller
        control={control}
        name="role"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipRow}>
            {roles.map((r) => (
              <Chip key={r.id} selected={value === r.id} onPress={() => onChange(r.id)} style={styles.chip}>
                {r.label}
              </Chip>
            ))}
          </View>
        )}
      />
      {errors.role ? <Text style={styles.errorText}>{errors.role.message}</Text> : null}

      <Text style={styles.fieldLabel}>Department Assignment</Text>
      <Controller
        control={control}
        name="departmentId"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipRow}>
            {departments.map((d) => (
              <Chip key={d.id} selected={value === d.id} onPress={() => onChange(d.id)} style={styles.chip}>
                {d.name}
              </Chip>
            ))}
          </View>
        )}
      />
      {errors.departmentId ? <Text style={styles.errorText}>{errors.departmentId.message}</Text> : null}

      <Text style={styles.fieldLabel}>Designation Assignment</Text>
      <Controller
        control={control}
        name="designationId"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipRow}>
            {designations.map((d) => (
              <Chip key={d.id} selected={value === d.id} onPress={() => onChange(d.id)} style={styles.chip}>
                {d.title}
              </Chip>
            ))}
          </View>
        )}
      />
      {errors.designationId ? <Text style={styles.errorText}>{errors.designationId.message}</Text> : null}

      <Text style={styles.fieldLabel}>Reporting Manager</Text>
      <Controller
        control={control}
        name="managerId"
        render={({ field: { onChange, value } }) => (
          <View style={styles.chipRow}>
            {managers.map((m) => (
              <Chip key={m.id} selected={value === m.id} onPress={() => onChange(m.id)} style={styles.chip}>
                {m.firstName} {m.lastName}
              </Chip>
            ))}
          </View>
        )}
      />

      {isEditMode ? (
        <>
          <Text style={styles.fieldLabel}>Account Status</Text>
          <Controller
            control={control}
            name="status"
            render={({ field: { onChange, value } }) => (
              <View style={styles.chipRow}>
                {statuses.map((s) => (
                  <Chip key={s.id} selected={value === s.id} onPress={() => onChange(s.id)} style={styles.chip}>
                    {s.label}
                  </Chip>
                ))}
              </View>
            )}
          />
          {errors.status ? <Text style={styles.errorText}>{errors.status.message}</Text> : null}
        </>
      ) : null}

      <Text style={styles.sectionTitle}>Emergency Contact</Text>
      <Controller
        control={control}
        name="emergencyContact.name"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Contact Name" value={value} onChangeText={onChange} error={errors.emergencyContact?.name?.message} />
        )}
      />
      <Controller
        control={control}
        name="emergencyContact.relationship"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Relationship" value={value} onChangeText={onChange} error={errors.emergencyContact?.relationship?.message} />
        )}
      />
      <Controller
        control={control}
        name="emergencyContact.phone"
        render={({ field: { onChange, value } }) => (
          <TextInput label="Emergency Phone" value={value} onChangeText={onChange} error={errors.emergencyContact?.phone?.message} keyboardType="phone-pad" />
        )}
      />

      <Button mode="contained" onPress={onSubmit} loading={isLoading} style={styles.submitButton}>
        {isEditMode ? 'Save Profile' : 'Register Employee'}
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#FFFFFF',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1F2937',
    marginTop: 16,
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    paddingBottom: 6,
  },
  fieldLabel: {
    fontSize: 13,
    color: '#4B5563',
    fontWeight: '600',
    marginBottom: 6,
    marginTop: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 4,
  },
  chip: {
    backgroundColor: '#F3F4F6',
  },
  errorText: {
    fontSize: 11,
    color: '#EF4444',
    marginTop: 4,
    fontWeight: '500',
  },
  submitButton: {
    marginTop: 24,
    backgroundColor: '#3B82F6',
    paddingVertical: 4,
    borderRadius: 8,
    marginBottom: 32,
  },
});
