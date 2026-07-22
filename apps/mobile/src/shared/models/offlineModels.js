/**
 * Offline Sync Event Types
 */
export const SYNC_EVENTS = {
  ATTENDANCE_CLOCK_IN: 'ATTENDANCE_CLOCK_IN',
  ATTENDANCE_CLOCK_OUT: 'ATTENDANCE_CLOCK_OUT',
  LEAVE_REQUEST_CREATE: 'LEAVE_REQUEST_CREATE',
  LEAVE_REQUEST_CANCEL: 'LEAVE_REQUEST_CANCEL',
  PROFILE_UPDATE: 'PROFILE_UPDATE',
  NOTIFICATION_MARK_READ: 'NOTIFICATION_MARK_READ',
};

/**
 * Conflict Resolution Strategies (Future implementation)
 */
export const CONFLICT_STRATEGIES = {
  CLIENT_WINS: 'CLIENT_WINS',
  SERVER_WINS: 'SERVER_WINS',
  MANUAL_MERGE: 'MANUAL_MERGE',
};

/**
 * Sync Result Status
 */
export const SYNC_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  SUCCESS: 'success',
  FAILED: 'failed',
  CONFLICT: 'conflict'
};

/**
 * Factory for creating offline actions
 */
export const createOfflineAction = (type, endpoint, method, payload, metadata = {}) => ({
  type,
  endpoint,
  method,
  payload,
  metadata
});
