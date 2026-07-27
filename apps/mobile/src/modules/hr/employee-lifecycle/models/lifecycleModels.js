/**
 * @typedef {Object} EmployeeConversion
 * @property {string} id
 * @property {string} offer_id
 * @property {string} candidate_name
 * @property {string} proposed_employee_id
 * @property {string} assigned_department
 * @property {string} assigned_manager
 * @property {string} joining_date
 * @property {string} status - Pending, Converted, Failed
 */

/**
 * @typedef {Object} OnboardingTask
 * @property {string} id
 * @property {string} employee_id
 * @property {string} task_name
 * @property {string} description
 * @property {string} due_date
 * @property {boolean} is_completed
 * @property {string} category - IT, HR, Manager, Buddy
 */

/**
 * @typedef {Object} ProbationRecord
 * @property {string} id
 * @property {string} employee_id
 * @property {string} start_date
 * @property {string} end_date
 * @property {string} status - Active, Extended, Completed
 * @property {string} review_notes
 */
