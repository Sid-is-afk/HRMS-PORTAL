/**
 * @typedef {Object} Shift
 * @property {string} id - Unique identifier
 * @property {string} name - Shift name (e.g., Morning Shift)
 * @property {string} type - Shift type
 * @property {string} startTime - HH:mm format
 * @property {string} endTime - HH:mm format
 * @property {number} breakDuration - Break duration in minutes
 * @property {string} color - Hex color code for calendar/UI
 * @property {string} description - Description of the shift
 * @property {string} status - 'ACTIVE', 'INACTIVE', 'ARCHIVED'
 * @property {string} [employeeAssignment] - Placeholder for employee assignments
 */

/**
 * @typedef {Object} ShiftTemplate
 * @property {string} id
 * @property {string} name
 * @property {Shift} baseShift
 */

/**
 * @typedef {Object} Holiday
 * @property {string} id
 * @property {string} name
 * @property {string} date - YYYY-MM-DD
 * @property {string} type - 'NATIONAL', 'REGIONAL', 'OPTIONAL'
 * @property {boolean} isRecurring
 */

/**
 * @typedef {Object} HolidayCalendar
 * @property {string} id
 * @property {string} name
 * @property {string} year
 * @property {string[]} groups - Array of applicable holiday groups
 * @property {Holiday[]} holidays
 */

/**
 * @typedef {Object} AttendancePolicy
 * @property {string} id
 * @property {string} name
 * @property {number} graceIn - Grace period for check-in (minutes)
 * @property {number} graceOut - Grace period for check-out (minutes)
 * @property {number} lateArrivalThreshold - Minutes until marked late
 * @property {number} earlyExitThreshold - Minutes until marked early exit
 * @property {number} halfDayThreshold - Minimum working hours for half-day
 * @property {number} absentThreshold - Minimum working hours for full day
 * @property {boolean} autoCheckout - Placeholder
 * @property {boolean} geofencing - Placeholder
 * @property {boolean} biometric - Placeholder
 */

/**
 * @typedef {Object} WeeklyOff
 * @property {string} id
 * @property {string[]} days - Array of days (e.g., ['Saturday', 'Sunday'])
 */

/**
 * @typedef {Object} WorkingHours
 * @property {string} id
 * @property {number} standardDailyHours
 * @property {number} standardWeeklyHours
 */

/**
 * @typedef {Object} GraceRule
 * @property {string} id
 * @property {number} graceMinutes
 * @property {string} penaltyType
 */

/**
 * @typedef {Object} BreakPolicy
 * @property {string} id
 * @property {number} standardBreakMinutes
 */

/**
 * @typedef {Object} OvertimePolicy
 * @property {string} id
 * @property {boolean} isEligible
 */

export {};
