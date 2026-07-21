/**
 * TypeScript type definitions for HRMS Portal.
 * Provides editor type safety, JSDoc completions, and formal API contract specifications.
 */

// Generic API Contracts
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: ApiErrorPayload;
  trace_id?: string;
}

export interface ApiErrorPayload {
  code: string;
  message: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page?: number;
  limit?: number;
}

// Domain Models

export interface User {
  id: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  role: 'EMPLOYEE' | 'HR_ADMIN' | 'MANAGER' | 'SUPER_ADMIN';
}

export interface Employee {
  id: string;
  companyId: string;
  branchId: string;
  departmentId: string;
  managerId?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  employmentStatus: 'ACTIVE' | 'INACTIVE';
  joiningDate: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string;
}

export interface AttendanceRecord {
  id: string;
  companyId: string;
  employeeId: string;
  attendanceDate: string; // YYYY-MM-DD
  clockIn: string; // ISO DateTime
  clockOut?: string; // ISO DateTime
  workingMinutes?: number;
  status: 'PRESENT' | 'ABSENT' | 'HALF_DAY' | 'LEAVE' | 'WEEKEND';
}

export interface LeaveRequest {
  id: string;
  companyId: string;
  employeeId: string;
  leaveType: string;
  startDate: string; // YYYY-MM-DD
  endDate: string; // YYYY-MM-DD
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'CANCELLED';
  duration: number;
  createdAt: string; // ISO DateTime
}

export interface LeaveType {
  id: string;
  label: string;
  description: string;
}

export interface LeaveBalance {
  total: number;
  used: number;
  remaining: number;
  pending: number;
}

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'announcement' | 'reminder';
  createdAt: string; // ISO DateTime
  read: boolean;
}

export interface Settings {
  preferences: {
    theme: 'light' | 'dark' | 'system';
    language: string;
  };
  notificationPreferences: {
    push: boolean;
    email: boolean;
    sms: boolean;
  };
  privacySettings: {
    profileVisibility: 'everyone' | 'employees' | 'private';
    showOnlineStatus: boolean;
  };
  securitySettings: {
    twoFactorEnabled: boolean;
    biometricsEnabled: boolean;
  };
}
