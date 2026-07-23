/**
 * @typedef {Object} AttendanceRecord
 * @property {string} id - UUID
 * @property {string} company_id
 * @property {string} employee_id
 * @property {string} attendance_date - YYYY-MM-DD
 * @property {string} clock_in - ISO 8601 Timestamp
 * @property {string} clock_out - ISO 8601 Timestamp
 * @property {number} working_minutes
 * @property {string} status - PRESENT, ABSENT, HALF_DAY, LEAVE, HOLIDAY, WEEKLY_OFF
 * @property {string} [shift_id] - Reference to Shift
 */

/**
 * @typedef {Object} AttendanceSummary
 * @property {number} totalPresent
 * @property {number} totalAbsent
 * @property {number} totalHalfDays
 * @property {number} totalLeaves
 * @property {number} totalLateArrivals
 * @property {number} totalEarlyExits
 * @property {number} totalWorkingMinutes
 * @property {string} period - 'MONTHLY' or 'WEEKLY'
 */

/**
 * @typedef {Object} AttendanceException
 * @property {string} id
 * @property {string} attendance_record_id
 * @property {string} type - 'LATE_ARRIVAL', 'EARLY_EXIT', 'MISSING_SWIPE'
 * @property {number} severity - 1 (Low), 2 (Medium), 3 (High)
 * @property {boolean} resolved
 */

/**
 * @typedef {Object} RegularizationRequest
 * @property {string} id
 * @property {string} attendance_record_id
 * @property {string} employee_id
 * @property {string} reason_code
 * @property {string} [comment]
 * @property {string} proposed_clock_in
 * @property {string} proposed_clock_out
 * @property {string} status - PENDING, APPROVED, REJECTED
 * @property {string} created_at
 */

/**
 * @typedef {Object} AttendanceFilter
 * @property {string} [department_id]
 * @property {string} [employee_id]
 * @property {string} [status]
 * @property {string} [startDate]
 * @property {string} [endDate]
 */

export {};
