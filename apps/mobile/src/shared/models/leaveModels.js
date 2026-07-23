/**
 * @typedef {Object} LeaveRequest
 * @property {string} id - UUID
 * @property {string} employee_id
 * @property {string} leave_type_id - Reference to Master Data (Annual, Sick, etc.)
 * @property {string} start_date - YYYY-MM-DD
 * @property {string} end_date - YYYY-MM-DD
 * @property {boolean} is_half_day
 * @property {string} reason
 * @property {string} status - PENDING, APPROVED, REJECTED, CANCELLED
 * @property {string} created_at
 * @property {string} updated_at
 */

/**
 * @typedef {Object} LeaveBalance
 * @property {string} employee_id
 * @property {string} leave_type_id
 * @property {number} allocated
 * @property {number} consumed
 * @property {number} balance
 * @property {number} pending
 */

/**
 * @typedef {Object} LeavePolicy
 * @property {string} id
 * @property {string} leave_type_id
 * @property {number} annual_allocation
 * @property {boolean} carry_forward_allowed
 * @property {number} max_carry_forward
 * @property {number} min_days_notice
 */

/**
 * @typedef {Object} LeaveFilter
 * @property {string} [department_id]
 * @property {string} [employee_id]
 * @property {string} [status]
 * @property {string} [leave_type_id]
 * @property {string} [startDate]
 * @property {string} [endDate]
 */

export {};
